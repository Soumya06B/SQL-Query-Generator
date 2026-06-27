from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime

class SQLAlternative(BaseModel):
    id: str
    title: str
    description: str
    sql: str
    cost: str

class GenerateSQLResponse(BaseModel):
    sql: str
    alternatives: List[SQLAlternative] = []
    explanation: Optional[str] = None
    tables: List[str] = []
    columns: List[str] = []

class ExplainQueryResponse(BaseModel):
    explanation: str

class ValidateQueryResponse(BaseModel):
    is_valid: bool
    errors: List[str] = []

class AnalyzeImpactResponse(BaseModel):
    estimated_rows: int
    cost_estimate: str
    warnings: List[str] = []

class ExecuteQueryResponse(BaseModel):
    status: str
    columns: List[str] = []
    rows: List[Dict[str, Any]] = []
    execution_time_ms: float = 0.0
    error: Optional[str] = None

class HistoryItemResponse(BaseModel):
    id: int
    prompt: str
    generated_sql: str
    execution_time_ms: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
