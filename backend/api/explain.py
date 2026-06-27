from fastapi import APIRouter
from backend.schemas.request import ExplainQueryRequest
from backend.schemas.response import ExplainQueryResponse
from backend.services.explanation_service import explain_sql

router = APIRouter()

@router.post("/explain-query", response_model=ExplainQueryResponse)
def explain_query(request: ExplainQueryRequest):
    explanation = explain_sql(request.sql_query)
    return ExplainQueryResponse(explanation=explanation)
