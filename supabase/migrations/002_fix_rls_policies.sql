-- =============================================================
-- DOJ MEDIA — Fix RLS Policies for Public Project Visibility
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor).
-- This migration is idempotent and safe to run multiple times.
-- =============================================================

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them.
-- This ensures the policies are correct even if the original
-- migration was only partially applied.

DROP POLICY IF EXISTS "Public can read published projects" ON projects;
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Authenticated users can read all projects" ON projects;
CREATE POLICY "Authenticated users can read all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);
