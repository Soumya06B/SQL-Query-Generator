import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { QueryAlternatives } from "../components/QueryAlternatives";
import { QueryExecution } from "../components/QueryExecution";
import { QueryHistory } from "../components/QueryHistory";
import { QueryInput } from "../components/QueryInput";
import { QueryResults } from "../components/QueryResults";
import api from "../services/api";

export function Home({ dbType = 'postgres' }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [activeAlternatives, setActiveAlternatives] = useState([]);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState(null);
  const [error, setError] = useState(null);
  
  // Minimal history state for the sidebar
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(0, 20);
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setActiveResult(null);
    setActiveAlternatives([]);
    
    try {
      // 1. Generate SQL
      const genResponse = await api.generateSql(prompt, dbType);
      const generatedSql = genResponse.sql;
      const alternatives = genResponse.alternatives || [];
      
      // 2. Validate SQL
      const valResponse = await api.validateQuery(generatedSql, dbType);
      if (!valResponse.is_valid) {
        console.warn("Validation Failed: ", valResponse.errors);
      }

      // 3. Explain and Analyze Impact (Parallel)
      const [explainRes, impactRes] = await Promise.all([
        api.explainQuery(generatedSql, dbType),
        api.analyzeImpact(generatedSql, dbType)
      ]);

      const newResult = {
        sql: generatedSql,
        explanation: explainRes.explanation,
        tables: genResponse.tables || [],
        impact: {
          cost: impactRes.cost_estimate,
          rows: impactRes.estimated_rows,
          description: impactRes.warnings.length > 0 ? impactRes.warnings.join(" ") : "Query looks optimal."
        },
        optimizations: impactRes.warnings,
        validation: valResponse
      };
      
      setActiveResult(newResult);
      setActiveAlternatives(alternatives);
      
      if (alternatives.length > 0) {
        setSelectedAlternativeId(alternatives[0].id);
      }

      // Sync history with backend
      try {
        const freshHistory = await api.getHistory(0, 20);
        setHistory(freshHistory);
      } catch (err) {
        console.error("Failed to sync history after generation:", err);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while generating the query.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setPrompt(item.prompt);
  };

  return (
    <div className="flex gap-8 h-full">
      {/* Left Column - Main Workspace */}
      <div className="flex-1 flex flex-col max-w-4xl relative">
        <QueryInput 
          prompt={prompt} 
          setPrompt={setPrompt} 
          onGenerate={handleGenerate} 
          isLoading={isLoading} 
        />
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Generation Failed</h4>
              <p className="text-sm opacity-90 mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {activeResult && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Query Results</h2>
              <QueryResults result={activeResult} />
            </div>
            
            {activeAlternatives.length > 0 && (
              <div className="mb-8">
                <QueryAlternatives 
                  alternatives={activeAlternatives} 
                  selectedId={selectedAlternativeId}
                  onSelect={setSelectedAlternativeId}
                />
              </div>
            )}

            <div>
              <QueryExecution 
                sql={
                  activeAlternatives.find(a => a.id === selectedAlternativeId)?.sql || 
                  activeResult.sql
                } 
                dbType={dbType}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Sidebar */}
      <div className="w-80 hidden lg:block">
        <div className="sticky top-0 h-[calc(100vh-8rem)]">
          <QueryHistory history={history} onSelect={handleHistorySelect} />
        </div>
      </div>
    </div>
  );
}
