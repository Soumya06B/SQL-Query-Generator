import { 
  LayoutDashboard, 
  TerminalSquare, 
  History, 
  Database, 
  Settings,
  Sparkles
} from "lucide-react";

export function Sidebar({ activeTab, onTabChange }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "query_generator", label: "Query Generator", icon: TerminalSquare },
    { id: "query_history", label: "Query History", icon: History },
    { id: "schema_explorer", label: "Schema Explorer", icon: Database },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-gray-800 bg-[#1a1d24]/80 backdrop-blur-md z-20">
      {/* Logo/Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <Database className="w-6 h-6 text-indigo-400" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          AI SQL Assistant
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              )}
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pro Upgrade/Footer Area */}
      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-indigo-500/20 p-4 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-colors" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-gray-200">Pro Plan</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Unlock advanced query optimizations and unlimited history.
          </p>
          <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 cursor-pointer">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
