-- Schéma de base pour une installation neuve de Circumpolar.
-- Ne pas rejouer ce fichier sur une base existante sans sauvegarde : il ne
-- remplace pas les migrations historiques.

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text,
  password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pictures (
  id bigserial PRIMARY KEY,
  title text,
  target text NOT NULL,
  target_category text NOT NULL,
  publicid text NOT NULL,
  annotated_publicid text,
  capture_date date NOT NULL,
  optics text NOT NULL,
  camera text NOT NULL,
  mount text,
  accessories jsonb,
  focal_length numeric,
  f_number numeric,
  capture_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  processing_software jsonb,
  ra numeric,
  dec numeric,
  bortle_class numeric,
  location text,
  upload_date timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pictures_capture_date_idx
  ON pictures (capture_date DESC);
CREATE INDEX IF NOT EXISTS pictures_upload_date_idx
  ON pictures (upload_date DESC);
CREATE INDEX IF NOT EXISTS pictures_target_idx
  ON pictures (target);

CREATE TABLE IF NOT EXISTS login_attempts (
  id bigserial PRIMARY KEY,
  key text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_attempts_key_time_idx
  ON login_attempts (key, attempted_at);

COMMIT;

-- Crée ensuite le compte administrateur avec un hash bcrypt, par exemple :
-- INSERT INTO users (username, email, password)
-- VALUES ('admin', NULL, '<hash-bcrypt>');
