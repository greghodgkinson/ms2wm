/*
  # MS2WM Migration Command Center Database Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, project name)
      - `description` (text, project description)
      - `status` (text, current status: draft, in_progress, completed, error)
      - `current_stage` (integer, current stage number 0-5)
      - `progress` (jsonb, progress percentages for each stage)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)
    
    - `project_files`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `file_type` (text, type: repos/inventory/target/manifest/runtime/cutover/environments)
      - `file_data` (jsonb, JSON file content)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)
    
    - `pipeline_executions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `stage_number` (integer, stage being executed)
      - `stage_name` (text, stage name)
      - `status` (text, execution status: pending, running, completed, failed)
      - `started_at` (timestamptz, start time)
      - `completed_at` (timestamptz, completion time)
      - `duration_minutes` (integer, execution duration)
      - `logs` (jsonb, execution logs array)
      - `error_message` (text, error details if failed)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (demo mode - no authentication required)
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  current_stage integer NOT NULL DEFAULT 0,
  progress jsonb DEFAULT '{"stage0":0,"stage1":0,"stage2":0,"stage3":0,"stage4":0,"stage5":0}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_type text NOT NULL,
  file_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pipeline_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage_number integer NOT NULL,
  stage_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  duration_minutes integer,
  logs jsonb DEFAULT '[]'::jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to projects"
  ON projects FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to projects"
  ON projects FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to project_files"
  ON project_files FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to project_files"
  ON project_files FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to project_files"
  ON project_files FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to project_files"
  ON project_files FOR DELETE
  USING (true);

CREATE POLICY "Allow public read access to pipeline_executions"
  ON pipeline_executions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to pipeline_executions"
  ON pipeline_executions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to pipeline_executions"
  ON pipeline_executions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_file_type ON project_files(file_type);
CREATE INDEX IF NOT EXISTS idx_pipeline_executions_project_id ON pipeline_executions(project_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_executions_stage ON pipeline_executions(stage_number);
