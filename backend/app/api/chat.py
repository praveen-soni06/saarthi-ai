from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chat import ChatRequest, ChatResponse, MessageItem, ThreadSummary
from app.models.db_models import ChatMessage, ChatThread
from app.services.llm_service import generate_response
from app.services.query_router import classify_query
from app.services.rag_service import search_college_documents

router = APIRouter()
threads_router = APIRouter()


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    if request.thread_id:
        thread = db.scalar(
            select(ChatThread).where(
                ChatThread.id == request.thread_id,
                ChatThread.user_id == request.user_id,
            )
        )
        if thread is None:
            raise HTTPException(status_code=404, detail="Chat thread not found.")
    else:
        thread = ChatThread(user_id=request.user_id)
        db.add(thread)

    try:
        db.flush()
        if thread.title == "New Chat":
            thread.title = request.question.strip()[:80] or "New Chat"
        db.add(
            ChatMessage(
                thread_id=thread.id,
                role="user",
                content=request.question,
            )
        )
        db.commit()
        db.refresh(thread)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the chat message.",
        ) from exc

    query_type = classify_query(request.question)
    context = ""
    sources: list[str] = []

    if query_type == "COLLEGE":
        rag_result = search_college_documents(request.question)
        if rag_result["found"]:
            context = rag_result["context"]
            sources = rag_result["sources"]

    prompt = (
        f"Context:\n{context}\n\n"
        f"User Question: {request.question}\n\n"
        "Answer:"
    )

    try:
        answer = generate_response(prompt)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail="The AI service is currently unavailable.",
            headers={"X-Thread-Id": thread.id},
        ) from exc

    db.add(
        ChatMessage(
            thread_id=thread.id,
            role="ai",
            content=answer,
        )
    )
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the assistant response.",
        ) from exc

    return ChatResponse(
        answer=answer,
        source=query_type.lower(),
        sources=sources,
        thread_id=thread.id,
    )


@threads_router.get("/threads/{user_id}", response_model=list[ThreadSummary])
def list_threads(user_id: str, db: Session = Depends(get_db)) -> list[ChatThread]:
    return list(
        db.scalars(
            select(ChatThread)
            .where(ChatThread.user_id == user_id)
            .order_by(ChatThread.created_at.desc())
        )
    )


@threads_router.get(
    "/threads/{thread_id}/messages",
    response_model=list[MessageItem],
)
def list_thread_messages(
    thread_id: str,
    user_id: str,
    db: Session = Depends(get_db),
) -> list[ChatMessage]:
    thread_exists = db.scalar(
        select(ChatThread.id).where(
            ChatThread.id == thread_id,
            ChatThread.user_id == user_id,
        )
    )
    if thread_exists is None:
        raise HTTPException(status_code=404, detail="Chat thread not found.")

    return list(
        db.scalars(
            select(ChatMessage)
            .where(ChatMessage.thread_id == thread_id)
            .order_by(ChatMessage.created_at.asc(), ChatMessage.id.asc())
        )
    )