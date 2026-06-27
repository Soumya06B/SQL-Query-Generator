import { Sidebar } from "./Sidebar";

export function Layout({ children, activeTab, onTabChange }) {
  const pageTitles = {
    dashboard: "Dashboard Overview",
    query_generator: "Query Generator",
    query_history: "Query History",
    schema_explorer: "Schema Explorer",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 flex font-sans selection:bg-indigo-500/30">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 bg-[#0f1115]/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-200">
            {pageTitles[activeTab]}
          </h2>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              PostgreSQL Connected
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 cursor-pointer hover:bg-indigo-500/30 transition-colors">
              <span className="text-sm font-bold text-indigo-400">AI</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
