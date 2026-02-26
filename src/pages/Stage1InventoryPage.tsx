import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard } from '../components/MetricCard';
import { loadStage1Data, loadProjectMetadata } from '../lib/dataLoader';
import { FileText, Database, Link, Code } from 'lucide-react';

export function Stage1InventoryPage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const inventory = loadStage1Data();
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  return (
    <Layout
      title={project.name}
      subtitle="Stage 1: Mule Application Inventory"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Comprehensive Inventory</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete analysis of all Mule flows, connectors, and configurations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <MetricCard
            title="Total Flows"
            value={inventory.total_flows}
            icon={FileText}
            color="blue"
          />
          <MetricCard
            title="Subflows"
            value={inventory.total_subflows}
            icon={Code}
            color="green"
          />
          <MetricCard
            title="Connectors"
            value={inventory.connectors.length}
            icon={Database}
            color="yellow"
          />
          <MetricCard
            title="API Endpoints"
            value={inventory.raml_endpoints.length}
            icon={Link}
            color="gray"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mule Flows ({inventory.flows.length})
            </h3>
            <div className="space-y-3">
              {inventory.flows.map((flow) => (
                <div
                  key={flow.name}
                  className="rounded-lg border border-gray-200 bg-white overflow-hidden"
                >
                  <div
                    onClick={() =>
                      setExpandedFlow(expandedFlow === flow.name ? null : flow.name)
                    }
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900">{flow.name}</h4>
                          <StatusBadge status={flow.type} size="sm" />
                          <StatusBadge status={flow.dataweave_complexity} size="sm" />
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{flow.trigger}</span>
                          {flow.http_method && <span className="font-medium">{flow.http_method}</span>}
                          {flow.http_path && <span className="text-blue-600">{flow.http_path}</span>}
                          <span>{flow.step_count} steps</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedFlow === flow.name && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-medium">Connectors</p>
                          <div className="mt-1 space-y-1">
                            {flow.connectors.length > 0 ? flow.connectors.map((conn: string) => (
                              <p key={conn} className="text-gray-900">{conn}</p>
                            )) : <p className="text-gray-500">None</p>}
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Transformations</p>
                          <p className="text-gray-900 mt-1">{flow.dataweave_transforms.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Error Handlers</p>
                          <p className="text-gray-900 mt-1">{flow.error_handlers.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Database Connectors ({inventory.connectors.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {inventory.connectors.map((connector) => (
                <div
                  key={connector.name}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{connector.name}</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900">{connector.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connection:</span>
                      <span className="font-medium text-gray-900">{connector.connection_type}</span>
                    </div>
                    {connector.details['listener-connection.host'] && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Host:</span>
                        <span className="font-medium text-gray-900">{connector.details['listener-connection.host']}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              API Endpoints ({inventory.raml_endpoints.length})
            </h3>
            <div className="space-y-2">
              {inventory.raml_endpoints.map((endpoint, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-mono text-xs font-semibold">
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-sm text-gray-900">{endpoint.path}</span>
                  </div>
                  <span className="text-sm text-gray-600">{endpoint.display_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
