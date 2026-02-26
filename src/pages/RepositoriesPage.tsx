import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard } from '../components/MetricCard';
import { formatDateTime } from '../lib/utils';
import { loadRepos, loadProjectMetadata } from '../lib/dataLoader';
import { GitBranch, FileCode, Settings, FolderGit2 } from 'lucide-react';

export function RepositoriesPage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const reposData = loadRepos();

  const totalMetrics = reposData.repositories.reduce(
    (acc, repo) => ({
      files: acc.files + (repo.metrics?.total_files || 0),
      flows: acc.flows + (repo.metrics?.mule_flows || 0),
      configs: acc.configs + (repo.metrics?.config_files || 0),
    }),
    { files: 0, flows: 0, configs: 0 }
  );

  return (
    <Layout
      title={project.name}
      subtitle="Stage 0: Repository Analysis"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Git Repositories</h2>
          <p className="text-sm text-gray-600 mt-1">
            Analysis of source code repositories containing Mule applications
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Total Files"
            value={totalMetrics.files}
            icon={FileCode}
            color="blue"
          />
          <MetricCard
            title="Mule Flows Discovered"
            value={totalMetrics.flows}
            icon={GitBranch}
            color="green"
          />
          <MetricCard
            title="Config Files"
            value={totalMetrics.configs}
            icon={Settings}
            color="gray"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Repositories ({reposData.repositories.length})
            </h3>
          </div>

          <div className="space-y-4">
            {reposData.repositories.map((repo) => (
              <div
                key={repo.id}
                className="rounded-lg border-2 border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <FolderGit2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{repo.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{repo.url}</p>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          {repo.branch}
                        </span>
                        {repo.last_scanned && (
                          <span>Last scanned: {formatDateTime(repo.last_scanned)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={repo.analysis_status} size="sm" />
                </div>

                {repo.metrics && (
                  <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Files</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {repo.metrics.total_files}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mule Flows</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {repo.metrics.mule_flows}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Config Files</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {repo.metrics.config_files}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors">
            Proceed to Inventory →
          </button>
        </div>
      </div>
    </Layout>
  );
}
