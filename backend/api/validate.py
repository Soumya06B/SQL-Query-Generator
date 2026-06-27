from fastapi import APIRouter
from backend.schemas.request import ValidateQueryRequest
from backend.schemas.response import ValidateQueryResponse
from backend.services.validation_service import validate_sql

router = APIRouter()

@router.post("/validate-query", response_model=ValidateQueryResponse)
def validate_query(request: ValidateQueryRequest):
    is_valid, errors = validate_sql(request.sql_query)
    return ValidateQueryResponse(is_valid=is_valid, errors=errors)
