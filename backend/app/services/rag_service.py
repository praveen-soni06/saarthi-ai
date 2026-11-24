import logging
from pathlib import Path
from typing import TypedDict

from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings

logger = logging.getLogger(__name__)
CHROMA_DB_PATH = Path("./data/chroma_db")

embeddings = OllamaEmbeddings(model="nomic-embed-text:latest")


class CollegeSearchResult(TypedDict):
    found: bool
    context: str
    sources: list[str]


def search_college_documents(query: str) -> CollegeSearchResult:
    """Find relevant college-document passages and their source filenames."""
    if not CHROMA_DB_PATH.is_dir():
        logger.info("ChromaDB directory does not exist: %s", CHROMA_DB_PATH)
        return {"found": False, "context": "", "sources": []}

    vector_store = Chroma(
        persist_directory=str(CHROMA_DB_PATH),
        embedding_function=embeddings,
    )
    documents = vector_store.similarity_search(query, k=4)
    if not documents:
        return {"found": False, "context": "", "sources": []}

    context = "\n\n".join(document.page_content for document in documents)
    sources: list[str] = []
    for document in documents:
        metadata = document.metadata
        filename = (
            metadata.get("filename")
            or metadata.get("file_name")
            or metadata.get("source")
        )
        if filename:
            source_name = Path(str(filename)).name
            if source_name not in sources:
                sources.append(source_name)

    return {"found": True, "context": context, "sources": sources}
