CREATE TABLE IF NOT EXISTS collection_runs (
  run_id TEXT PRIMARY KEY,
  trigger_kind TEXT NOT NULL,
  scheduled_at TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  observed_count INTEGER NOT NULL DEFAULT 0,
  fetched_count INTEGER NOT NULL DEFAULT 0
);
