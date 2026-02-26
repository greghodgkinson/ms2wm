import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { loadProjectMetadata } from '../lib/dataLoader';
import {
  GitBranch,
  FileText,
  Network,
  Package,
  Settings,
  Rocket,
  Server,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { cn } from '../lib/utils';

const stages = [
  {
    id: 0,
    title: 'Repository Analysis',
    description: 'Analyze Git repositories and discover Mule flows',
    icon: GitBranch,
    path: 'repositories',
  },
  {
    id: 1,
    title: 'Inventory',
    description: 'Comprehensive inventory of all Mule assets',
    icon: FileText,
    path: 'stage1',
  },
  {
    id: 2,
    title: 'Target Architecture',
    description: 'webMethods services and consolidation strategy',
    icon: Network,
    path: 'stage2',
  },
  {
    id: 3,
    title: 'Asset Manifest',
    description: 'webMethods implementation artifacts',
    icon: Package,
    path: 'stage3',
  },
  {
    id: 4,
    title: 'Runtime Configuration',
    description: 'Environment settings and deployment configs',
    icon: Settings,
    path: 'stage4',
  },
  {
    id: 5,
    title: 'Cut-Over & Validation',
    description: 'Testing, deployment, and go-live procedures',
    icon: Rocket,
    path: 'stage5',
  },
];

export function ProjectDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = loadProjectMetadata();

  const getStageStatus = (stageId: number) => {
    if (stageId < project.current_stage) return 'completed';
    if (stageId === project.current_stage) return 'in_progress';
    return 'pending';
  };

  const getStageProgress = (stageId: number): number => {
    if (!project.progress) return 0;
    const key = `stage${stageId}` as keyof typeof project.progress;
    return project.progress[key] || 0;
  };

  const isStageAccessible = (stageId: number) => {
    return stageId <= project.current_stage;
  };

  const handleStageClick = (stageId: number, path: string) => {
    if (isStageAccessible(stageId)) {
      navigate(`/projects/${projectId}/${path}`);
    }
  };

  return (
    <Layout
      title={project.name}
      subtitle={project.description}
      backLink="/"
      backLabel="All Projects"
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Migration Journey</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track progress through all migration stages
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={project.status} />
            <button
              onClick={() => navigate(`/projects/${projectId}/environments`)}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <Server className="h-4 w-4" />
              View Environments
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            const progress = getStageProgress(stage.id);
            const accessible = isStageAccessible(stage.id);
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                onClick={() => handleStageClick(stage.id, stage.path)}
                className={cn(
                  'relative rounded-lg border-2 bg-white p-6 transition-all',
                  accessible
                    ? 'cursor-pointer hover:border-blue-400 hover:shadow-lg'
                    : 'cursor-not-allowed opacity-60',
                  status === 'in_progress' && 'border-blue-400 ring-2 ring-blue-100',
                  status === 'completed' && 'border-green-300',
                  status === 'pending' && 'border-gray-200'
                )}
              >
                {!accessible && (
                  <div className="absolute top-4 right-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'rounded-lg p-3',
                      status === 'completed' && 'bg-green-100',
                      status === 'in_progress' && 'bg-blue-100',
                      status === 'pending' && 'bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        status === 'completed' && 'text-green-600',
                        status === 'in_progress' && 'text-blue-600',
                        status === 'pending' && 'text-gray-400'
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{stage.title}</h3>
                      {accessible && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{progress}%</span>
                  </div>
                  <ProgressBar
                    value={progress}
                    color={
                      status === 'completed'
                        ? 'green'
                        : status === 'in_progress'
                        ? 'blue'
                        : 'gray'
                    }
                  />
                </div>

                <div className="mt-4">
                  <StatusBadge status={status} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
