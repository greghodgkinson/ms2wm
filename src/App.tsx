import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDashboard } from './pages/ProjectDashboard';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { Stage1InventoryPage } from './pages/Stage1InventoryPage';
import { Stage2ArchitecturePage } from './pages/Stage2ArchitecturePage';
import { Stage3ManifestPage } from './pages/Stage3ManifestPage';
import { Stage4RuntimePage } from './pages/Stage4RuntimePage';
import { Stage5CutoverPage } from './pages/Stage5CutoverPage';
import { EnvironmentsPage } from './pages/EnvironmentsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDashboard />} />
        <Route path="/projects/:projectId/repositories" element={<RepositoriesPage />} />
        <Route path="/projects/:projectId/stage1" element={<Stage1InventoryPage />} />
        <Route path="/projects/:projectId/stage2" element={<Stage2ArchitecturePage />} />
        <Route path="/projects/:projectId/stage3" element={<Stage3ManifestPage />} />
        <Route path="/projects/:projectId/stage4" element={<Stage4RuntimePage />} />
        <Route path="/projects/:projectId/stage5" element={<Stage5CutoverPage />} />
        <Route path="/projects/:projectId/environments" element={<EnvironmentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
