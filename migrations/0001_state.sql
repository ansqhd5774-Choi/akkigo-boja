CREATE TABLE IF NOT EXISTS source_observations (
  source_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  http_status INTEGER,
  status TEXT NOT NULL,
  body_hash TEXT,
  title TEXT
);
CREATE TABLE IF NOT EXISTS hub_state (
  hub_key TEXT PRIMARY KEY,
  post_id TEXT UNIQUE,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS publish_attempts (
  attempt_id TEXT PRIMARY KEY,
  hub_key TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  error_code TEXT
);
