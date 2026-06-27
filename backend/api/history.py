from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.schemas.response import HistoryItemResponse
from backend.database.session import get_db
from backend.models.history import QueryHistory

router = APIRouter()

@router.get("/history", response_model=List[HistoryItemResponse])
def get_history(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    history = db.query(QueryHistory).order_by(QueryHistory.created_at.desc()).offset(skip).limit(limit).all()
    return history
