CREATE TABLE IF NOT EXISTS coupon_candidates (
  candidate_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  source_url TEXT NOT NULL,
  source_body_hash TEXT NOT NULL,
  payload_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_coupon_candidates_status_source
  ON coupon_candidates(status, source_id, last_seen_at);
