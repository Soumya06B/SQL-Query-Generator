import { 
  Settings as SettingsIcon, Database, Bell, Shield, 
  Key, User, Monitor, Zap
} from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "database", label: "Database", icon: Database },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Settings Navigation */}
      <div className="w-64 flex-shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-medium" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : "text-gray-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 glass-panel rounded-2xl border border-gray-800 p-8 overflow-y-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === "general" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <User className="w-6 h-6 text-indigo-400" />
                  Account Settings
                </h3>
                <p className="text-sm text-gray-400 mb-6">Manage your account details and preferences.</p>
                
                <div className="grid gap-6 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Display Name</label>
                    <input type="text" defaultValue="Sarah Jenkins" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input type="email" defaultValue="sarah.j@example.com" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-800">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Monitor className="w-6 h-6 text-indigo-400" />
                  Appearance
                </h3>
                <p className="text-sm text-gray-400 mb-6">Customize how the application looks on your device.</p>
                
                <div className="flex gap-4">
                  <button className="flex-1 p-4 rounded-xl border-2 border-indigo-500 bg-gray-900 flex flex-col items-center gap-2">
                    <div className="w-full h-24 bg-[#0f1115] rounded-lg border border-gray-800 flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-gray-800 rounded"></div>
                    </div>
                    <span className="font-medium text-indigo-400">Dark Mode</span>
                  </button>
                  <button className="flex-1 p-4 rounded-xl border-2 border-transparent bg-gray-800/50 hover:bg-gray-800 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-white rounded shadow-sm"></div>
                    </div>
                    <span className="font-medium text-gray-400">Light Mode (Coming Soon)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Database className="w-6 h-6 text-indigo-400" />
                  Connection Settings
                </h3>
                <p className="text-sm text-gray-400 mb-6">Manage your active database connections.</p>
                
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <h4 className="font-semibold text-lg">Production PostgreSQL</h4>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 text-xs font-medium">
                      Connected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-gray-500">Host</span>
                      <p className="font-mono text-gray-200">db.production.example.com</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">Port</span>
                      <p className="font-mono text-gray-200">5432</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">Database</span>
                      <p className="font-mono text-gray-200">analytics_main</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">User</span>
                      <p className="font-mono text-gray-200">query_generator_role</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-800 flex gap-3">
                    <button className="btn-secondary text-sm">Test Connection</button>
                    <button className="btn-primary text-sm bg-red-600 hover:bg-red-700 shadow-red-500/30">Disconnect</button>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-gray-800">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Zap className="w-6 h-6 text-indigo-400" />
                  Query Preferences
                </h3>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                    <div>
                      <h4 className="font-medium text-gray-200">Auto-Optimization</h4>
                      <p className="text-xs text-gray-500">Automatically suggest index improvements for slow queries.</p>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-800">
                    <div>
                      <h4 className="font-medium text-gray-200">Strict Mode</h4>
                      <p className="text-xs text-gray-500">Prevent queries that might perform full table scans.</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "notifications" || activeTab === "security") && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Key className="w-12 h-12 mb-4 opacity-20" />
              <p>This section is currently under development.</p>
            </div>
          )}
          
          <div className="mt-8 pt-8 border-t border-gray-800 flex justify-end">
            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
