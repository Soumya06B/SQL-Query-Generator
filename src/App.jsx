import { useState } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Home as QueryGenerator } from "./pages/Home";
import { QueryHistoryPage } from "./pages/QueryHistoryPage";
import { SchemaExplorer } from "./pages/SchemaExplorer";
import { Settings } from "./pages/Settings";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dbType, setDbType] = useState("postgres");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard dbType={dbType} />;
      case "query_generator":
        return <QueryGenerator dbType={dbType} />;
      case "query_history":
        return <QueryHistoryPage dbType={dbType} />;
      case "schema_explorer":
        return <SchemaExplorer dbType={dbType} />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard dbType={dbType} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} dbType={dbType} onDbTypeChange={setDbType}>
      {renderContent()}
    </Layout>
  );
}

export default App;
