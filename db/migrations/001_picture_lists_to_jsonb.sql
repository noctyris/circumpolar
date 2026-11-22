-- Convertit les listes stockées en texte séparé par des virgules en tableaux JSONB.
-- À exécuter avec la même version du code que celle qui lit les tableaux JSONB.
-- Le code applicatif accepte encore l'ancien format texte tant que cette migration
-- n'est pas passée.

BEGIN;

ALTER TABLE pictures
  ADD COLUMN accessories_json jsonb,
  ADD COLUMN processing_software_json jsonb;

UPDATE pictures
SET
  accessories_json = CASE
    WHEN accessories IS NULL OR btrim(accessories) = '' THEN NULL
    ELSE (
      SELECT jsonb_agg(btrim(item) ORDER BY ordinality)
      FROM unnest(string_to_array(accessories, ',')) WITH ORDINALITY AS parts(item, ordinality)
      WHERE btrim(item) <> ''
    )
  END,
  processing_software_json = CASE
    WHEN processing_software IS NULL OR btrim(processing_software) = '' THEN NULL
    ELSE (
      SELECT jsonb_agg(btrim(item) ORDER BY ordinality)
      FROM unnest(string_to_array(processing_software, ',')) WITH ORDINALITY AS parts(item, ordinality)
      WHERE btrim(item) <> ''
    )
  END;

ALTER TABLE pictures DROP COLUMN accessories;
ALTER TABLE pictures DROP COLUMN processing_software;

ALTER TABLE pictures
  RENAME COLUMN accessories_json TO accessories;
ALTER TABLE pictures
  RENAME COLUMN processing_software_json TO processing_software;

ALTER TABLE pictures
  ADD CONSTRAINT accessories_is_array
    CHECK (accessories IS NULL OR jsonb_typeof(accessories) = 'array'),
  ADD CONSTRAINT processing_software_is_array
    CHECK (processing_software IS NULL OR jsonb_typeof(processing_software) = 'array');

COMMIT;
