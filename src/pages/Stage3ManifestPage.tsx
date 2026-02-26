import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { loadStage3Data, loadProjectMetadata } from '../lib/dataLoader';
import { Database, Workflow, Globe, FileType, AlertTriangle } from 'lucide-react';

export function Stage3ManifestPage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const manifest = loadStage3Data();
  const [selectedType, setSelectedType] = useState<string>('all');

  const assetsByType = manifest.assets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, typeof manifest.assets>);

  const hasConfigWarnings = manifest.assets.some((asset) =>
    JSON.stringify(asset).includes('CHANGE_ME')
  );

  return (
    <Layout
      title={project.name}
      subtitle="Stage 3: webMethods Asset Manifest"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Implementation Assets</h2>
          <p className="text-sm text-gray-600 mt-1">
            Generated webMethods connectors, flows, and API definitions
          </p>
        </div>

        {hasConfigWarnings && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Configuration Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Some assets contain CHANGE_ME placeholders that need to be updated with actual
                  values before deployment.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-5">
          <MetricCard
            title="DB Connectors"
            value={manifest.assets.filter((a) => a.type === 'db_connector').length}
            icon={Database}
            color="blue"
          />
          <MetricCard
            title="Integration Flows"
            value={manifest.assets.filter((a) => a.type === 'integration_flow').length}
            icon={Workflow}
            color="green"
          />
          <MetricCard
            title="HTTP Listeners"
            value={manifest.assets.filter((a) => a.type === 'http_listener').length}
            icon={Globe}
            color="yellow"
          />
          <MetricCard
            title="REST Endpoints"
            value={manifest.assets.filter((a) => a.type === 'rest_endpoint').length}
            icon={FileType}
            color="red"
          />
          <MetricCard
            title="Document Types"
            value={manifest.assets.filter((a) => a.type === 'document_type').length}
            icon={FileType}
            color="gray"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Assets ({manifest.assets.length})
          </button>
          {Object.keys(assetsByType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.replace(/_/g, ' ')} ({assetsByType[type].length})
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {(selectedType === 'all' ? manifest.assets : assetsByType[selectedType] || []).map(
            (asset, idx) => {
              const hasWarning = JSON.stringify(asset).includes('CHANGE_ME');
              return (
                <div
                  key={idx}
                  className={`rounded-lg border bg-white p-4 ${
                    hasWarning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900">{asset.name}</h4>
                        <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                          {asset.type}
                        </span>
                        {hasWarning && (
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Config needed
                          </span>
                        )}
                      </div>
                      {asset.description && (
                        <p className="text-sm text-gray-600 mt-2">{asset.description}</p>
                      )}
                      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        {Object.entries(asset as Record<string, unknown>)
                          .filter(
                            ([key, value]) =>
                              !['type', 'name', 'description'].includes(key) &&
                              typeof value !== 'object'
                          )
                          .slice(0, 6)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>
                              <span
                                className={`font-medium ${
                                  String(value).includes('CHANGE_ME')
                                    ? 'text-yellow-700'
                                    : 'text-gray-900'
                                }`}
                              >
                                {String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </Layout>
  );
}
