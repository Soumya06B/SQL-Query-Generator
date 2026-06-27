import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// No mock schema; rely on backend default or dynamically fetch if endpoint exists
export const generateSql = async (prompt) => {
  const response = await api.post('/generate-sql', {
    prompt
  });
  return response.data;
};

export const explainQuery = async (sqlQuery) => {
  const response = await api.post('/explain-query', {
    sql_query: sqlQuery
  });
  return response.data;
};

export const analyzeImpact = async (sqlQuery) => {
  const response = await api.post('/analyze-impact', {
    sql_query: sqlQuery
  });
  return response.data;
};

export const validateQuery = async (sqlQuery) => {
  const response = await api.post('/validate-query', {
    sql_query: sqlQuery
  });
  return response.data;
};

export const getHistory = async (skip = 0, limit = 50) => {
  const response = await api.get('/history', {
    params: { skip, limit }
  });
  return response.data;
};

export default {
  generateSql,
  explainQuery,
  analyzeImpact,
  validateQuery,
  getHistory
};
