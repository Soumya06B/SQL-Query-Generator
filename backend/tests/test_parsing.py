from backend.api.generate_sql import clean_json_response, normalize_alternatives

def test_clean_json_response_markdown():
    raw = "```json\n{\"sql\": \"SELECT * FROM users\"}\n```"
    cleaned = clean_json_response(raw)
    assert cleaned == "{\"sql\": \"SELECT * FROM users\"}"

def test_clean_json_response_extra_text():
    raw = "Here is the query:\n{\"sql\": \"SELECT 1\"}\nHope this helps!"
    cleaned = clean_json_response(raw)
    assert cleaned == "{\"sql\": \"SELECT 1\"}"

def test_clean_json_response_plain():
    raw = "{\"sql\": \"SELECT 2\"}"
    cleaned = clean_json_response(raw)
    assert cleaned == "{\"sql\": \"SELECT 2\"}"

def test_normalize_alternatives_mixed():
    alts = [
        "SELECT * FROM A",
        {"sql": "SELECT * FROM B"}
    ]
    normalized = normalize_alternatives(alts)
    assert len(normalized) == 2
    assert normalized[0]["sql"] == "SELECT * FROM A"
    assert normalized[0]["id"] == "1"
    assert normalized[0]["title"] == "Alternative 1"
    
    assert normalized[1]["sql"] == "SELECT * FROM B"
    assert normalized[1]["title"] == "Alternative 2" # if dict lacks title
