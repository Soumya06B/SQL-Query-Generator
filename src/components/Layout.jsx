import { Sidebar } from "./Sidebar";

export function Layout({ children, activeTab, onTabChange, dbType, onDbTypeChange }) {
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
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800 shadow-inner">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${dbType === 'postgres' ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
              <select
                value={dbType}
                onChange={(e) => onDbTypeChange(e.target.value)}
                className="bg-transparent text-sm font-medium text-gray-300 outline-none cursor-pointer appearance-none pr-4"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '0.65em auto' }}
              >
                <option value="postgres" className="bg-gray-900">PostgreSQL</option>
                <option value="mysql" className="bg-gray-900">MySQL</option>
              </select>
            </div>
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
