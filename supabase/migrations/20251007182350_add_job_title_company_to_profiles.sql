-- Add job_title and company fields to profiles
alter table public.profiles
  add column if not exists job_title text,
  add column if not exists company text;
