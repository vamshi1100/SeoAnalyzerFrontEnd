
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import WebsiteAudit from "./pages/WebsiteAudit";
import AuditResults from "./pages/AuditResults";
import AIProviderSettings from "./pages/AIProviderSettings";
import Navbar from "./components/Navbar";
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/audit" element={<WebsiteAudit />} />

        <Route path="/results" element={<AuditResults />} />
        <Route path="/settings/ai" element={<AIProviderSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
