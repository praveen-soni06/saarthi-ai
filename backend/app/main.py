from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_database_tables
from app.api import chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database_tables()
    yield


app = FastAPI(title="SAARTHI AI Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Thread-Id"],
)

app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])
app.include_router(chat.threads_router, tags=["Chat history"])


@app.get("/")
def root():
    return {"message": "SAARTHI AI backend running", "status": "ok"}