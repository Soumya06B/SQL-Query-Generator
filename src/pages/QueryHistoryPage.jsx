import { Search, Filter, Calendar, Clock, Play, Copy, MoreVertical, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../services/api";

export function QueryHistoryPage() {
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(0, 50);
        setHistory(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch query history.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const filteredHistory = history.filter(h => 
    h.prompt.toLowerCase().includes(search.toLowerCase()) || 
    h.generated_sql.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* Filters and Search */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text"
            placeholder="Search queries or prompts..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-secondary text-sm flex-1 md:flex-none">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="btn-secondary text-sm flex-1 md:flex-none">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
          <div>
            <h4 className="font-semibold text-sm">Error</h4>
            <p className="text-sm opacity-90 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const { date, time } = formatDate(item.created_at);
            const costLabel = item.status === "failed" ? "Failed" : "Success";
            
            return (
              <div key={item.id} className="glass-panel p-5 rounded-xl border border-gray-800 group hover:border-indigo-500/30 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-200 truncate">{item.prompt}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border flex-shrink-0 ${
                        costLabel === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {costLabel}
                      </span>
                    </div>
                    
                    <div className="bg-gray-900/80 p-3 rounded-lg border border-gray-800 font-mono text-sm text-indigo-300/90 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                      {item.generated_sql}
                    </div>
                    
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {time}</span>
                      {item.execution_time_ms && (
                        <span>Duration: <strong className="text-gray-300 font-medium">{item.execution_time_ms.toFixed(2)}ms</strong></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20" title="Run Query">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors" title="Copy SQL">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-12">
            No queries found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
