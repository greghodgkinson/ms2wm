import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { formatDate } from '../lib/utils';
import { FolderGit2, Plus } from 'lucide-react';
import { loadProjectMetadata } from '../lib/dataLoader';

export default function ProjectsPage() {
  const navigate = useNavigate();

  let project;
  try {
    project = loadProjectMetadata();
  } catch (error) {
    console.error('Error loading project metadata:', error);
    return <div style={{ padding: '20px' }}>Error loading project data: {String(error)}</div>;
  }

  const getOverallProgress = () => {
    if (!project.progress) return 0;
    const stages = Object.values(project.progress);
    return Math.round(stages.reduce((a, b) => a + b, 0) / stages.length);
  };

  return (
    <Layout
      title="MS2WM Migration Command Center"
      subtitle="Manage and monitor your Mule to webMethods migration projects"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
          <p className="text-sm text-gray-600 mt-1">
            Click on a project to view its migration journey
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => navigate(`/projects/${project.id}`)}
          className="cursor-pointer rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-blue-400 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <FolderGit2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                <p className="text-sm text-gray-600 mt-0.5">Stage {project.current_stage}/5</p>
              </div>
            </div>
            <StatusBadge status={project.status} size="sm" />
          </div>

          <p className="mt-4 text-sm text-gray-600 line-clamp-2">{project.description}</p>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium text-gray-900">{getOverallProgress()}%</span>
            </div>
            <ProgressBar value={getOverallProgress()} color="blue" />
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>Created {formatDate(project.created_at)}</span>
            <span>Updated {formatDate(project.updated_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-100 cursor-pointer">
          <div className="text-center">
            <Plus className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">Create New Project</p>
            <p className="mt-1 text-xs text-gray-500">Start a new migration journey</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
