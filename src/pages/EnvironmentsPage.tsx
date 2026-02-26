import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard } from '../components/MetricCard';
import { formatDateTime } from '../lib/utils';
import { loadEnvironments, loadProjectMetadata } from '../lib/dataLoader';
import { Server, Activity, AlertCircle, TrendingUp } from 'lucide-react';

export function EnvironmentsPage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const envData = loadEnvironments();

  return (
    <Layout
      title={project.name}
      subtitle="Environment Deployments"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Deployment Environments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage deployments across all environments
          </p>
        </div>

        <div className="space-y-6">
          {envData.environments.map((env) => (
            <div key={env.name} className="rounded-lg border-2 border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-3 ${
                      env.type === 'production'
                        ? 'bg-red-100'
                        : env.type === 'staging'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    <Server
                      className={`h-6 w-6 ${
                        env.type === 'production'
                          ? 'text-red-600'
                          : env.type === 'staging'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{env.name}</h3>
                    <p className="text-sm text-gray-600">{env.api_url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={env.deployment_status} />
                  <StatusBadge status={env.health_status} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-4 mb-6">
                <MetricCard
                  title="Requests/min"
                  value={env.metrics.requests_per_minute}
                  icon={Activity}
                  color="blue"
                />
                <MetricCard
                  title="Avg Response"
                  value={`${env.metrics.avg_response_time_ms}ms`}
                  icon={TrendingUp}
                  color="green"
                />
                <MetricCard
                  title="Error Rate"
                  value={`${env.metrics.error_rate_percent}%`}
                  icon={AlertCircle}
                  color={env.metrics.error_rate_percent > 1 ? 'red' : 'green'}
                />
                <MetricCard
                  title="Uptime"
                  value={`${env.metrics.uptime_percent}%`}
                  icon={Server}
                  color="green"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Deployed Services ({env.services.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {env.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="text-gray-900">{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">v{service.version}</span>
                        <StatusBadge status={service.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Infrastructure:</span>
                    <span className="ml-2 text-gray-900">{env.infrastructure.server_specs}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Region:</span>
                    <span className="ml-2 text-gray-900">{env.infrastructure.region}</span>
                  </div>
                  {env.last_deployed && (
                    <div>
                      <span className="text-gray-600">Last deployed:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDateTime(env.last_deployed)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
