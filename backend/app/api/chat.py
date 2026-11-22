# backend/app/api/chat.py
from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.query_router import classify_query
from app.services.rag_service import search_college_documents
from app.services.llm_service import generate_response

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # 1. Sawal ka type pata karo
        query_type = classify_query(request.question)
        
        # 2. Agar College ka sawal hai, toh documents search karo
        context = ""
        sources = []
        if query_type == "COLLEGE":
            rag_result = search_college_documents(request.question)
            if rag_result["found"]:
                context = rag_result["context"]
                sources = rag_result["sources"]
        
        # 3. Prompt taiyar karo
        prompt = f"Context: {context}\n\nUser Question: {request.question}\n\nAnswer:"
        
        # 4. Gemini se answer lao
        answer = generate_response(prompt)
        
        return ChatResponse(
            answer=answer,
            source=query_type.lower(),
            sources=sources
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))