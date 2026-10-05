CREATE UNIQUE INDEX IF NOT EXISTS one_unresolved_publish_per_hub
ON publish_attempts(hub_key) WHERE status IN ('RUNNING','UNKNOWN');
