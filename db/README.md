# Base de données

Circumpolar utilise PostgreSQL. Deux points d'entrée existent :

- `schema.sql` : point de départ pour une base **neuve**.
- `migrations/` : évolutions destinées à une base existante.

## Installation neuve

```bash
psql "$POSTGRES_URL" -f db/schema.sql
```

Le schéma inclut déjà les colonnes JSONB `accessories` et
`processing_software`. **Ne pas appliquer `001_picture_lists_to_jsonb.sql`**
sur une installation neuve : cette migration ne concerne que les anciennes
bases où ces colonnes étaient du texte séparé par des virgules.

## Base existante

Toujours sauvegarder avant une migration.

1. `001_picture_lists_to_jsonb.sql` : convertit les anciennes listes texte en
   JSONB. À exécuter uniquement si les colonnes sont encore de type texte.
2. `002_login_attempts.sql` : ajoute la table du limiteur de connexion.

## Compte administrateur

L'application utilise actuellement le compte `admin`. Créer son mot de passe
avec un hash bcrypt, puis l'insérer dans `users` :

```sql
INSERT INTO users (username, email, password)
VALUES ('admin', NULL, '<hash-bcrypt>');
```

Le mot de passe doit être hashé côté outil, jamais stocké en clair.
