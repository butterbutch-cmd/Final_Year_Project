# file location: payment-integration/rag-service/rag_chain.py
import os
from typing import List
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from dotenv import load_dotenv

load_dotenv()

DOCS_FOLDER = "./docs"
VECTORSTORE_PATH = "./vectorstore"
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# ── Custom Prompt ─────────────────────────────────────────────────────────────
# If the retrieved context doesn't cover the question, the LLM will fall back
# to its own plant knowledge instead of saying "I don't know".

# custom_prompt = PromptTemplate(
#     input_variables=["context", "question"],
#     template="""You are FloraVerse, a friendly and expert plant care assistant for a plant e-commerce platform.

# Use the context below to answer the user's question.
# If the context does not contain relevant information about the question, use your own extensive plant knowledge to give a helpful, accurate answer.
# Never say "I don't know" or "it is not mentioned in the context" — always provide useful plant care guidance.
# Keep your answers friendly, clear, and practical.

# Context:
# {context}

# Question: {question}

# Answer:"""
# )

custom_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""You are FloraVerse, a friendly and expert plant care assistant for a plant e-commerce platform.

Use the context below to answer the user's question.
If the context does not contain relevant information about the question, use your own extensive plant knowledge to give a helpful, accurate answer.
Never say "I don't know" or "it is not mentioned in the context" — always provide useful plant care guidance.

IMPORTANT RULES:
- Keep your answer under 100 words.
- Be concise and direct.
- Avoid long explanations.
- Use short paragraphs or bullet points when helpful.

Context:
{context}

Question: {question}

Answer:"""
)


def load_documents(folder: str) -> List[Document]:
    """Load all PDFs from a folder and split into chunks."""
    if not os.path.exists(folder):
        raise FileNotFoundError(f"Docs folder not found: {folder}")

    pdf_files = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
    if not pdf_files:
        raise ValueError(f"No PDF files found in {folder}")

    raw_docs: List[Document] = []

    for filename in pdf_files:
        path = os.path.join(folder, filename)
        try:
            loader = PyPDFLoader(path)
            pages = loader.load()

            if not pages:
                print(f"  ✗ No text extracted: {filename}")
                continue

            raw_docs.extend(pages)
            print(f"  ✓ Loaded: {filename} ({len(pages)} pages)")
        except Exception as e:
            print(f"  ✗ Failed: {filename} — {e}")

    if not raw_docs:
        raise ValueError(
            "No text could be extracted from any PDF. "
            "Your PDF may be scanned, corrupted, or not text-based."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(raw_docs)

    if not chunks:
        raise ValueError("Documents were loaded, but splitting produced 0 chunks.")

    print(f"  ✓ {len(chunks)} chunks created from {len(pdf_files)} files")
    return chunks


def build_vectorstore(chunks: List[Document], embeddings) -> FAISS:
    """Build a FAISS vectorstore from document chunks."""
    if not chunks:
        raise ValueError("Cannot build vectorstore: chunk list is empty.")

    vs = FAISS.from_documents(chunks, embeddings)
    print("  ✓ Vectorstore built")
    return vs


print("\n── Initializing RAG Service ──")

print("1. Loading embedding model...")
embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL,
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True},
)

print("2. Loading vectorstore...")

if os.path.exists(VECTORSTORE_PATH) and os.listdir(VECTORSTORE_PATH):
    # ── Load existing vectorstore from disk (fast, no re-embedding) ──
    print("  ✓ Existing vectorstore found — loading from disk...")
    vectorstore = FAISS.load_local(
        VECTORSTORE_PATH,
        embeddings,
        allow_dangerous_deserialization=True,
    )
    print("  ✓ Vectorstore loaded from disk")
else:
    # ── Build from scratch and persist ──
    print("  ✗ No vectorstore found — building from documents...")
    chunks = load_documents(DOCS_FOLDER)

    print("3. Building vectorstore...")
    vectorstore = build_vectorstore(chunks, embeddings)

    os.makedirs(VECTORSTORE_PATH, exist_ok=True)
    vectorstore.save_local(VECTORSTORE_PATH)
    print(f"  ✓ Vectorstore saved to '{VECTORSTORE_PATH}'")
    print(f"     └─ index.faiss  (vector index)")
    print(f"     └─ index.pkl    (docstore metadata)")

print("4. Loading Groq LLM...")
llm = ChatGroq(
    model=GROQ_MODEL,
    temperature=0,
    groq_api_key=GROQ_API_KEY,
    max_tokens=100,
)

print("── Ready ──\n")

_sessions: dict = {}


def get_chain(session_id: str) -> ConversationalRetrievalChain:
    if session_id not in _sessions:
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4},
        )
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            output_key="answer",
            chat_memory=ChatMessageHistory(),
            return_messages=True,
        )
        chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=retriever,
            memory=memory,
            return_source_documents=True,
            chain_type="stuff",
            verbose=False,
            combine_docs_chain_kwargs={"prompt": custom_prompt},  # 👈 fallback prompt
        )
        _sessions[session_id] = chain
        print(f"  [+] New session: {session_id}")

    return _sessions[session_id]


def clear_session(session_id: str):
    if session_id in _sessions:
        del _sessions[session_id]
        print(f"  [-] Cleared session: {session_id}")