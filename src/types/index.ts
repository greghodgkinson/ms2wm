export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed' | 'error';
  current_stage: number;
  created_at: string;
  updated_at: string;
  progress?: {
    stage0: number;
    stage1: number;
    stage2: number;
    stage3: number;
    stage4: number;
    stage5: number;
  };
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  branch: string;
  analysis_status: 'pending' | 'analyzing' | 'analyzed' | 'error';
  last_scanned?: string;
  metrics?: {
    total_files: number;
    mule_flows: number;
    config_files: number;
  };
}

export interface Flow {
  flowName: string;
  type: string;
  trigger: string;
  httpMethod?: string;
  path?: string;
  processors: number;
  complexity: 'low' | 'medium' | 'high';
  details?: any;
}

export interface Connector {
  name: string;
  type: string;
  connectionType: string;
  config: Record<string, any>;
}

export interface RAMLEndpoint {
  path: string;
  method: string;
  queryParams?: string[];
  description?: string;
}

export interface DataWeaveTransformation {
  name: string;
  complexity: 'low' | 'medium' | 'high';
  inputFormat: string;
  outputFormat: string;
}

export interface ConfigProperty {
  key: string;
  value: string;
  environment?: string;
}

export interface InventoryData {
  summary: {
    totalFlows: number;
    totalSubflows: number;
    totalConnectors: number;
    totalEndpoints: number;
  };
  flowsData: Flow[];
  connectorsData: Connector[];
  ramlEndpoints: RAMLEndpoint[];
  dataweaveTransformations: DataWeaveTransformation[];
  configPropertiesData: ConfigProperty[];
}

export interface FlowService {
  name: string;
  description: string;
  absorbed_mule_flows: string[];
  http_method: string;
  path: string;
  complexity: string;
  estimated_migration_time_minutes: number;
  source_mule_flows?: any[];
}

export interface RestAPI {
  name: string;
  version: string;
  description: string;
  resources: any[];
}

export interface TargetArchitecture {
  consolidation_summary: {
    total_mule_flows: number;
    total_wm_flow_services: number;
    consolidation_ratio: string;
    total_estimated_minutes: number;
  };
  flow_services: FlowService[];
  rest_apis: RestAPI[];
  workflows: any[];
}

export interface Asset {
  asset_type: string;
  name: string;
  description?: string;
  [key: string]: any;
}

export interface AssetManifest {
  summary: {
    total_assets: number;
    db_connectors: number;
    integration_flows: number;
    http_listeners: number;
    rest_endpoints: number;
    document_types: number;
  };
  assets: Asset[];
}

export interface EnvironmentConfig {
  name: string;
  server: {
    host: string;
    port: number;
    protocol: string;
  };
  database: {
    host: string;
    port: number;
    database: string;
    user: string;
    max_connections: number;
    min_connections: number;
  };
  integration_server: {
    memory_allocation: string;
    thread_pool_size: number;
    timeout_seconds: number;
  };
  monitoring: {
    metrics_enabled: boolean;
    health_check_path: string;
    log_level: string;
  };
  security: {
    ssl_enabled: boolean;
    authentication_method: string;
  };
}

export interface RuntimeConfigs {
  environments: {
    development: EnvironmentConfig;
    staging: EnvironmentConfig;
    production: EnvironmentConfig;
  };
}

export interface TestResult {
  test_suite_name: string;
  test_type: string;
  status: 'passed' | 'failed' | 'skipped';
  execution_time_ms: number;
  assertions_passed: number;
  assertions_total: number;
  details?: any;
}

export interface CutOverStep {
  step_number: number;
  title: string;
  description: string;
  responsible: string;
  estimated_duration_minutes: number;
  dependencies?: number[];
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

export interface CutOverData {
  test_results: TestResult[];
  migration_runbook: CutOverStep[];
  dns_routing_plan: any;
  rollback_procedures: any[];
  stakeholder_approvals: any[];
  validation_checklist: any[];
}

export interface Environment {
  name: string;
  type: 'development' | 'staging' | 'production';
  api_url: string;
  deployment_status: 'not_deployed' | 'deploying' | 'deployed' | 'error';
  health_status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  last_deployed?: string;
  services: {
    name: string;
    version: string;
    status: string;
  }[];
  infrastructure: {
    server_specs: string;
    region: string;
    availability_zone: string;
  };
}

export interface PipelineExecution {
  id: string;
  project_id: string;
  stage_number: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  logs: {
    timestamp: string;
    level: 'info' | 'warning' | 'error';
    message: string;
  }[];
  error_message?: string;
}
