
import logging

from langchain_core.messages import HumanMessage
from langchain_ollama import ChatOllama

logger = logging.getLogger(__name__)

llm = ChatOllama(model="deepseek-r1:1.5b", temperature=0.6)


def generate_response(prompt: str) -> str:
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
    except Exception as exc:
        logger.exception("Failed to generate a response with Ollama")
        raise RuntimeError("The language model is currently unavailable.") from exc

    if not isinstance(response.content, str):
        logger.error("Ollama returned a non-text response")
        raise RuntimeError("The language model returned an invalid response.")

    return response.content