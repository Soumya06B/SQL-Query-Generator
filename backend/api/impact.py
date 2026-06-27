from fastapi import APIRouter
from backend.schemas.request import AnalyzeImpactRequest
from backend.schemas.response import AnalyzeImpactResponse
from backend.services.impact_service import analyze_query_impact

router = APIRouter()

@router.post("/analyze-impact", response_model=AnalyzeImpactResponse)
def analyze_impact(request: AnalyzeImpactRequest):
    rows, cost, warnings = analyze_query_impact(request.sql_query)
    return AnalyzeImpactResponse(
        estimated_rows=rows,
        cost_estimate=cost,
        warnings=warnings
    )
