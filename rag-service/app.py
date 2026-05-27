# # rag-service/app.py

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from rag_chain import get_chain, clear_session
# import os

# app = FastAPI(title="Plant RAG Chatbot")

# # ── CORS ─────────────────────────────────────────────────────────────────────
# # Allow your React frontend and Node backend to call this service.

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://localhost:5000"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Request / Response Schemas ────────────────────────────────────────────────

# class ChatRequest(BaseModel):
#     session_id: str   # Unique ID per user/conversation (e.g. user's MongoDB _id)
#     message: str      # The user's question

# class Source(BaseModel):
#     page: int | str
#     file: str
#     content: str

# class ChatResponse(BaseModel):
#     answer: str
#     sources: list[Source]

# # ── Endpoints ─────────────────────────────────────────────────────────────────

# @app.get("/health")
# def health():
#     """Quick check that the service is running."""
#     return {"status": "ok"}


# @app.post("/chat", response_model=ChatResponse)
# async def chat(req: ChatRequest):
#     """
#     Main chat endpoint.
#     Receives a message, runs it through the RAG chain, returns an answer + sources.
#     """
#     if not req.message.strip():
#         raise HTTPException(status_code=400, detail="Message cannot be empty")

#     chain = get_chain(req.session_id)

#     try:
#         result = await chain.acall({"question": req.message})
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     # Format sources
#     sources = []
#     for doc in result.get("source_documents", []):
#         sources.append(Source(
#             page=doc.metadata.get("page", "N/A"),
#             file=os.path.basename(doc.metadata.get("source", "unknown")),
#             content=doc.page_content[:300],   # first 300 chars is enough
#         ))

#     return ChatResponse(answer=result["answer"], sources=sources)


# @app.delete("/session/{session_id}")
# def delete_session(session_id: str):
#     """Clear a user's conversation memory (e.g. when they click 'New Chat')."""
#     clear_session(session_id)
#     return {"status": "cleared", "session_id": session_id}


# rag-service/app.py



#fastapi is used for the creating  the backend API service that the React frontend will call to get answers from the RAG chain. It defines endpoints for chatting and session management.
from fastapi import FastAPI, HTTPException                      #httpsexception is used to handle errors and return appropriate HTTP status to the client
from fastapi.middleware.cors import CORSMiddleware              #CORS middleware is added to allow cross-origin requests from the frontend and backend during development
from pydantic import BaseModel                                  #pydantic is used to define request and response schemas for the chat endpoint, ensuring type safety and data validation
from rag_chain import get_chain, clear_session                  #get_chain and clear_session are imported from rag_chain.py to manage RAG chains per user session
import os                                                       #os is used for file path operations, such as loading the vectorstore and formatting source document metadata

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
    session_id: str   
    message: str    

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

    return ChatResponse(
        answer=result["answer"], # this is the answer generated by the RAG chain based on the user's question and retrieved documents, which will be sent back to the frontend to display to the user
        sources=sources # this is a list of source documents that were retrieved and used to generate the answer, which will also be sent back to the frontend so the user can see where the information came from
        ) 


@app.delete("/session/{session_id}")
def delete_session(session_id: str):
    """Clear a user's conversation memory (e.g. when they click 'New Chat')."""
    clear_session(session_id)
    return {"status": "cleared", "session_id": session_id}