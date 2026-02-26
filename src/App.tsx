import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectsPage from './pages/ProjectsPage';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { EnvironmentsPage } from './pages/EnvironmentsPage';
import { Stage1InventoryPage } from './pages/Stage1InventoryPage';
import { Stage2ArchitecturePage } from './pages/Stage2ArchitecturePage';
import { Stage3ManifestPage } from './pages/Stage3ManifestPage';
import { Stage4RuntimePage } from './pages/Stage4RuntimePage';
import { Stage5CutoverPage } from './pages/Stage5CutoverPage';
import { initializeProject } from './lib/dataLoader';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeProject()
      .then(() => setIsInitialized(true))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          MS2WM Migration Dashboard
        </h1>
        <p style={{ fontSize: '24px', opacity: 0.9, color: '#fca5a5' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          MS2WM Migration Dashboard
        </h1>
        <p style={{ fontSize: '24px', opacity: 0.9 }}>
          Initializing system...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route index element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDashboard />} />
        <Route path="projects/:projectId/repositories" element={<RepositoriesPage />} />
        <Route path="projects/:projectId/environments" element={<EnvironmentsPage />} />
        <Route path="projects/:projectId/stage1" element={<Stage1InventoryPage />} />
        <Route path="projects/:projectId/stage2" element={<Stage2ArchitecturePage />} />
        <Route path="projects/:projectId/stage3" element={<Stage3ManifestPage />} />
        <Route path="projects/:projectId/stage4" element={<Stage4RuntimePage />} />
        <Route path="projects/:projectId/stage5" element={<Stage5CutoverPage />} />
      </Routes>
    </Router>
  );
}

export default App;
