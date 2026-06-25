import { Database } from "lucide-react";
import { useState } from "react";
import { QueryAlternatives } from "../components/QueryAlternatives";
import { QueryExecution } from "../components/QueryExecution";
import { QueryHistory } from "../components/QueryHistory";
import { QueryInput } from "../components/QueryInput";
import { QueryResults } from "../components/QueryResults";

export function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [history, setHistory] = useState([
    {
      prompt: "Show me all active users who haven't logged in for 30 days",
      sql: "SELECT * FROM users WHERE status = 'active' AND last_login < NOW() - INTERVAL '30 days';"
    }
  ]);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState(null);

  const mockAlternatives = [
    {
      id: "alt-1",
      title: "Standard JOIN",
      description: "Uses a standard INNER JOIN which is well supported across all SQL engines.",
      sql: "SELECT u.id, u.name, o.order_date FROM users u JOIN orders o ON u.id = o.user_id WHERE u.signup_date > '2023-08-01' AND o.total > 100;",
      cost: "Medium"
    },
    {
      id: "alt-2",
      title: "EXISTS Clause (Optimized)",
      description: "More efficient if you only need user details without joining all order rows.",
      sql: "SELECT u.id, u.name FROM users u WHERE u.signup_date > '2023-08-01' AND EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.total > 100);",
      cost: "Low"
    }
  ];

  const handleGenerate = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedSql = "SELECT u.id, u.name, o.order_date FROM users u JOIN orders o ON u.id = o.user_id WHERE u.signup_date > '2023-08-01' AND o.total > 100;";
      
      const newResult = {
        sql: generatedSql,
        explanation: "This query retrieves the ID and name of users who signed up after August 1, 2023, along with their order dates, for orders where the total amount exceeded $100. It achieves this by performing an inner join between the 'users' and 'orders' tables on the user ID.",
        tables: ["users", "orders"],
        impact: {
          cost: "45.2",
          rows: 1500,
          description: "Full table scan on 'orders' might occur if 'user_id' is not indexed. Consider adding an index."
        },
        optimizations: [
          "Add an index on orders.user_id for faster lookups.",
          "Partition the orders table by date if it's very large."
        ]
      };
      
      setActiveResult(newResult);
      setSelectedAlternativeId("alt-1");
      
      setHistory(prev => [
        { prompt, sql: generatedSql },
        ...prev
      ]);
      
      setIsLoading(false);
    }, 1500);
  };

  const handleHistorySelect = (item) => {
    setPrompt(item.prompt);
    // In a real app, this might fetch the result details again
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1d24]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Database className="w-6 h-6 text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              AI SQL Assistant
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700">
              PostgreSQL
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex gap-8">
        
        {/* Left Column - Main Workspace */}
        <div className="flex-1 flex flex-col max-w-4xl">
          <QueryInput 
            prompt={prompt} 
            setPrompt={setPrompt} 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
          />
          
          {activeResult && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Query Results</h2>
                <QueryResults result={activeResult} />
              </div>
              
              <div className="mb-8">
                <QueryAlternatives 
                  alternatives={mockAlternatives} 
                  selectedId={selectedAlternativeId}
                  onSelect={setSelectedAlternativeId}
                />
              </div>

              <div>
                <QueryExecution sql={mockAlternatives.find(a => a.id === selectedAlternativeId)?.sql || activeResult.sql} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-80 hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            <QueryHistory history={history} onSelect={handleHistorySelect} />
          </div>
        </div>
      </main>
    </div>
  );
}
