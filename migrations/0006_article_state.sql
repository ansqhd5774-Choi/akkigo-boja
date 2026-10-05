CREATE TABLE IF NOT EXISTS article_state (
  article_key TEXT PRIMARY KEY,
  post_id TEXT UNIQUE,
  public_url TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS article_publish_attempts (
  attempt_id TEXT PRIMARY KEY,
  article_key TEXT NOT NULL,
  operation TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  error_code TEXT
);

CREATE INDEX IF NOT EXISTS idx_article_publish_attempts_key_status
  ON article_publish_attempts(article_key, status, started_at);
