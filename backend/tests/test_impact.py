from backend.services.impact_service import analyze_query_impact

def test_impact_static_checks():
    rows, cost, warnings = analyze_query_impact("SELECT * FROM users", "sqlite")
    # "sqlite" engine mock behavior
    assert any("SELECT *" in w for w in warnings)
    assert any("Full table scan" in w for w in warnings)

def test_impact_no_warnings():
    rows, cost, warnings = analyze_query_impact("SELECT id FROM users WHERE id = 1", "sqlite")
    assert len(warnings) == 1
    assert "sqlite" in warnings[0].lower()
