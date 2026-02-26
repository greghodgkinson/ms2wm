import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';
import { loadStage5Data, loadProjectMetadata } from '../lib/dataLoader';
import { CheckCircle2, Clock, Shield } from 'lucide-react';

export function Stage5CutoverPage() {
  const { projectId } = useParams();
  const project = loadProjectMetadata();
  const cutover = loadStage5Data();

  const totalTests = cutover.test_results.reduce(
    (acc, suite) => acc + suite.assertions_total,
    0
  );
  const passedTests = cutover.test_results.reduce(
    (acc, suite) => acc + suite.assertions_passed,
    0
  );

  const completedSteps = cutover.migration_runbook.filter((s) => s.status === 'completed').length;
  const totalSteps = cutover.migration_runbook.length;

  return (
    <Layout
      title={project.name}
      subtitle="Stage 5: Cut-Over Planning & Validation"
      backLink={`/projects/${projectId}`}
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Cut-Over & Go-Live</h2>
          <p className="text-sm text-gray-600 mt-1">
            Testing results, migration runbook, and deployment validation
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <MetricCard
            title="Tests Passed"
            value={`${passedTests}/${totalTests}`}
            subtitle={`${Math.round((passedTests / totalTests) * 100)}% success rate`}
            icon={CheckCircle2}
            color="green"
          />
          <MetricCard
            title="Runbook Progress"
            value={`${completedSteps}/${totalSteps}`}
            subtitle={`${Math.round((completedSteps / totalSteps) * 100)}% complete`}
            icon={Clock}
            color="blue"
          />
          <MetricCard
            title="Test Suites"
            value={cutover.test_results.length}
            subtitle="All suites passed"
            icon={Shield}
            color="green"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-3">
            {cutover.test_results.map((suite, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{suite.test_suite_name}</h4>
                    <StatusBadge status={suite.status} size="sm" />
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                      {suite.test_type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{suite.execution_time_ms}ms</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>
                    {suite.assertions_passed}/{suite.assertions_total} assertions passed
                  </span>
                  <ProgressBar
                    value={suite.assertions_passed}
                    max={suite.assertions_total}
                    color="green"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Migration Runbook ({completedSteps}/{totalSteps} steps completed)
          </h3>
          <div className="space-y-2">
            {cutover.migration_runbook.map((step) => (
              <div
                key={step.step_number}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        step.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : step.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {step.step_number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        <StatusBadge status={step.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Responsible: {step.responsible}</span>
                        <span>Est. {step.estimated_duration_minutes} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Checklist</h3>
          <div className="space-y-2">
            {cutover.validation_checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <span className="text-sm text-gray-900">{item.item}</span>
                <StatusBadge status={item.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
