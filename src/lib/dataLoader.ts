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
