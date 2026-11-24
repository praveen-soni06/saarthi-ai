from fastapi import APIRouter, HTTPException

from app.models.chat import ChatRequest, ChatResponse
from app.services.llm_service import generate_response
from app.services.query_router import classify_query
from app.services.rag_service import search_college_documents

router = APIRouter()


@router.post("/", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest) -> ChatResponse:
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
        ) from exc

    return ChatResponse(
        answer=answer,
        source=query_type.lower(),
        sources=sources,
    )