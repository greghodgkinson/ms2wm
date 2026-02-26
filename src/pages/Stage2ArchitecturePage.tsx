import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { loadStage2Data, loadProjectMetadata } from '../lib/dataLoader';
import { Workflow, TrendingDown, Clock } from 'lucide-react';
import { useState } from 'react';

export function Stage2ArchitecturePage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const architecture = loadStage2Data();
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <Layout
      title={project.name}
      subtitle="Stage 2: Target webMethods Architecture"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Architecture Consolidation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Optimized webMethods services with flow consolidation strategy
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Mule Flows"
            value={architecture.consolidation.mule_flow_count}
            subtitle="Input flows"
            icon={Workflow}
            color="blue"
          />
          <MetricCard
            title="WM Services"
            value={architecture.consolidation.wm_service_count}
            subtitle={architecture.consolidation.reduction_ratio}
            icon={TrendingDown}
            color="green"
          />
          <MetricCard
            title="Est. Migration Time"
            value={`${Math.round(architecture.flow_services.reduce((sum, s) => sum + s.estimated_minutes, 0) / 60)}h`}
            subtitle={`${architecture.flow_services.reduce((sum, s) => sum + s.estimated_minutes, 0)} minutes`}
            icon={Clock}
            color="yellow"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            webMethods Flow Services ({architecture.flow_services.length})
          </h3>
          <div className="space-y-3">
            {architecture.flow_services.map((service) => (
              <div
                key={service.name}
                className="rounded-lg border border-gray-200 bg-white overflow-hidden"
              >
                <div
                  onClick={() =>
                    setExpandedService(expandedService === service.name ? null : service.name)
                  }
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                        {service.absorbs_mule_flows.length} flows
                      </span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                        {service.complexity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                    <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                      <span>{service.http_method || 'N/A'}</span>
                      {service.http_path && service.http_path !== '' && (
                        <span className="text-blue-600">{service.http_path}</span>
                      )}
                      <span>{service.estimated_minutes} min estimate</span>
                    </div>
                  </div>
                </div>

                {expandedService === service.name && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Absorbed Mule Flows:</h5>
                    <div className="space-y-2">
                      {service.absorbs_mule_flows.map((flowName) => (
                        <div
                          key={flowName}
                          className="bg-white rounded px-3 py-2 text-sm"
                        >
                          <span className="text-gray-900">{flowName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            REST APIs ({architecture.rest_apis.length})
          </h3>
          <div className="space-y-4">
            {architecture.rest_apis.map((api) => (
              <div key={api.name} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{api.name}</h4>
                  <span className="text-sm text-gray-600">{api.base_path}</span>
                </div>
                <div className="space-y-2">
                  {api.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm bg-gray-50 p-2 rounded">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                        {resource.method}
                      </span>
                      <span className="text-gray-900 font-mono">{resource.path}</span>
                      <span className="text-gray-600">→ {resource.flow_service}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
