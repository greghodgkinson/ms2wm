import { supabase } from './supabase';
import projectMetadata from '../data/projects/hotel-sys-api/project-metadata.json';
import repos from '../data/projects/hotel-sys-api/repos.json';
import stage1Inventory from '../data/projects/hotel-sys-api/stage1-inventory.json';
import stage2Architecture from '../data/projects/hotel-sys-api/stage2-target-architecture.json';
import stage3Manifest from '../data/projects/hotel-sys-api/stage3-asset-manifest.json';
import stage4Runtime from '../data/projects/hotel-sys-api/stage4-runtime-configs.json';
import stage5Cutover from '../data/projects/hotel-sys-api/stage5-cutover.json';
import environments from '../data/projects/hotel-sys-api/environments.json';
import pipelineHistory from '../data/projects/hotel-sys-api/pipeline-history.json';

export const loadProjectMetadata = () => projectMetadata;
export const loadRepos = () => repos;
export const loadStage1Data = () => stage1Inventory;
export const loadStage2Data = () => stage2Architecture;
export const loadStage3Data = () => stage3Manifest;
export const loadStage4Data = () => stage4Runtime;
export const loadStage5Data = () => stage5Cutover;
export const loadEnvironments = () => environments;
export const loadPipelineHistory = () => pipelineHistory;

export const loadStageData = (stageNumber: number) => {
  switch (stageNumber) {
    case 0:
      return loadRepos();
    case 1:
      return loadStage1Data();
    case 2:
      return loadStage2Data();
    case 3:
      return loadStage3Data();
    case 4:
      return loadStage4Data();
    case 5:
      return loadStage5Data();
    default:
      return null;
  }
};

export const initializeProject = async () => {
  const { data: existingProjects } = await supabase
    .from('projects')
    .select('id')
    .limit(1);

  if (existingProjects && existingProjects.length > 0) {
    return existingProjects[0].id;
  }

  const { data: newProject } = await supabase
    .from('projects')
    .insert({
      name: 'Hotel System API',
      description: 'Migration of legacy Mule 4 hotel reservation and management system to webMethods Integration Platform',
      status: 'in_progress',
      current_stage: 3,
      progress: {
        stage0: 100,
        stage1: 100,
        stage2: 100,
        stage3: 75,
        stage4: 30,
        stage5: 0
      }
    })
    .select('id')
    .single();

  if (!newProject) throw new Error('Failed to create project');

  const projectId = newProject.id;

  await supabase.from('project_files').insert([
    { project_id: projectId, file_type: 'repos', file_data: repos },
    { project_id: projectId, file_type: 'environments', file_data: environments },
    { project_id: projectId, file_type: 'stage1', file_data: stage1Inventory },
    { project_id: projectId, file_type: 'stage2', file_data: stage2Architecture },
    { project_id: projectId, file_type: 'stage3', file_data: stage3Manifest },
    { project_id: projectId, file_type: 'stage4', file_data: stage4Runtime },
    { project_id: projectId, file_type: 'stage5', file_data: stage5Cutover },
  ]);

  const executions = pipelineHistory.executions.map((exec: any) => ({
    project_id: projectId,
    stage_number: exec.stage_number,
    stage_name: exec.stage_name,
    status: exec.status,
    started_at: exec.started_at,
    completed_at: exec.completed_at,
    duration_minutes: exec.duration_minutes,
    logs: exec.logs
  }));

  await supabase.from('pipeline_executions').insert(executions);

  return projectId;
};
