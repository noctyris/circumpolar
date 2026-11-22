-- Table utilisée par le limiteur de tentatives de connexion partagé.
-- À appliquer sur les bases existantes pour que le rate limit survive aux
-- redémarrages et soit partagé entre instances.

BEGIN;

CREATE TABLE IF NOT EXISTS login_attempts (
  id bigserial PRIMARY KEY,
  key text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_attempts_key_time_idx
  ON login_attempts (key, attempted_at);

COMMIT;
