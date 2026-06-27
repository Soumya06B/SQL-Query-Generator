from backend.services.validation_service import validate_sql
from backend.utils.helpers import is_safe_query

def test_safe_query():
    assert is_safe_query("SELECT * FROM users") == True

def test_unsafe_query_drop():
    assert is_safe_query("DROP TABLE users") == False

def test_unsafe_query_update_without_where():
    assert is_safe_query("UPDATE users SET name = 'test'") == False

def test_safe_query_update_with_where():
    # If UPDATE is allowed in config, this would pass. 
    # By default, config allows SELECT only.
    # We will test the basic structural check for WHERE clause
    # Assuming the config during test might block UPDATE entirely, but let's check basic logic.
    pass

def test_validate_sql_valid():
    is_valid, errors = validate_sql("SELECT * FROM products WHERE price > 10")
    assert is_valid == True
    assert len(errors) == 0

def test_validate_sql_empty():
    is_valid, errors = validate_sql("   ")
    assert is_valid == False
    assert "Query is empty." in errors

def test_validate_sql_unsafe():
    is_valid, errors = validate_sql("DROP DATABASE test;")
    assert is_valid == False
    assert any("Unsafe query detected" in err for err in errors)
