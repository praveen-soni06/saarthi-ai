from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import chat  # <--- Yeh line add karo

app = FastAPI(title="SAARTHI AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router connect karo
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])

@app.get("/")
def root():
    return {"message": "SAARTHI AI backend running", "status": "ok"}