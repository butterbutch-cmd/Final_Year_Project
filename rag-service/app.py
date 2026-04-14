# rag-service/app.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_chain import get_chain, clear_session
import os

app = FastAPI(title="Plant RAG Chatbot")

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allow your React frontend and Node backend to call this service.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request / Response Schemas ────────────────────────────────────────────────

class ChatRequest(BaseModel):
    session_id: str   # Unique ID per user/conversation (e.g. user's MongoDB _id)
    message: str      # The user's question

class Source(BaseModel):
    page: int | str
    file: str
    content: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]

# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    """Quick check that the service is running."""
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Main chat endpoint.
    Receives a message, runs it through the RAG chain, returns an answer + sources.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    chain = get_chain(req.session_id)

    try:
        result = await chain.acall({"question": req.message})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Format sources
    sources = []
    for doc in result.get("source_documents", []):
        sources.append(Source(
            page=doc.metadata.get("page", "N/A"),
            file=os.path.basename(doc.metadata.get("source", "unknown")),
            content=doc.page_content[:300],   # first 300 chars is enough
        ))

    return ChatResponse(answer=result["answer"], sources=sources)


@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    """Clear a user's conversation memory (e.g. when they click 'New Chat')."""
    clear_session(session_id)
    return {"status": "cleared", "session_id": session_id}