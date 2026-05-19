from typing import Type, TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


def mongo_to_pydantic(doc: dict, model: Type[T]) -> T:
    doc = doc.copy()
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return model(**doc)


def mongo_to_list(documents: list[dict], model: Type[T]) -> list[T]:
    return [mongo_to_pydantic(doc, model) for doc in documents]
