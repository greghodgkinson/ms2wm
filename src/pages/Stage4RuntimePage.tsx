import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { loadStage4Data, loadProjectMetadata } from '../lib/dataLoader';
import { Server } from 'lucide-react';

export function Stage4RuntimePage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const runtime = loadStage4Data();
  const [selectedEnv, setSelectedEnv] = useState<'development' | 'staging' | 'production'>(
    'development'
  );

  const envConfig = runtime.environments[selectedEnv];

  return (
    <Layout
      title={project.name}
      subtitle="Stage 4: Runtime & Environment Configuration"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Environment Configuration</h2>
          <p className="text-sm text-gray-600 mt-1">
            Server, database, and integration server settings for each environment
          </p>
        </div>

        <div className="flex gap-2">
          {(['development', 'staging', 'production'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors capitalize ${
                selectedEnv === env
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {env}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <Server className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Server Configuration</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Host:</span>
                <span className="font-medium text-gray-900">{envConfig.server.host}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Port:</span>
                <span className="font-medium text-gray-900">{envConfig.server.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protocol:</span>
                <span className="font-medium text-gray-900">{envConfig.server.protocol}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Database Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Host:</span>
                <span className="font-medium text-gray-900">{envConfig.database.host}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Port:</span>
                <span className="font-medium text-gray-900">{envConfig.database.port}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-medium text-gray-900">{envConfig.database.database}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Connections:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.database.max_connections}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Integration Server</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Memory:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.integration_server.memory_allocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thread Pool:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.integration_server.thread_pool_size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timeout:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.integration_server.timeout_seconds}s
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Security & Monitoring</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">SSL Enabled:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.security.ssl_enabled ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Authentication:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.security.authentication_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Log Level:</span>
                <span className="font-medium text-gray-900">
                  {envConfig.monitoring.log_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
