import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Home as QueryGenerator } from "./pages/Home";
import { QueryHistoryPage } from "./pages/QueryHistoryPage";
import { SchemaExplorer } from "./pages/SchemaExplorer";
import { Settings } from "./pages/Settings";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "query_generator":
        return <QueryGenerator />;
      case "query_history":
        return <QueryHistoryPage />;
      case "schema_explorer":
        return <SchemaExplorer />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
