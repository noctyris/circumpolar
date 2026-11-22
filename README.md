# 🌌 Circumpolar

Portfolio d'astrophotographie personnel : ciel profond, Lune, Soleil et
planétaire, avec les détails d'acquisition et de traitement de chaque image.

🌐 **Site** : [circumpolar.dpdns.org](https://circumpolar.dpdns.org)

---

## ✨ Fonctionnalités

- Galerie filtrable et groupable, avec ouverture des images en modale.
- Fiches techniques : matériel, poses, filtres, logiciels, coordonnées et
  classe de Bortle.
- Versions annotées quand elles existent.
- Administration protégée : ajout, modification et suppression d'images,
  uploads Cloudinary signés.
- Flux RSS, sitemap, robots et métadonnées Open Graph.

## 🛠️ Stack

- **Next.js 16** (App Router, Server Components), React 19, TypeScript.
- **Tailwind CSS 4**.
- **PostgreSQL** pour les métadonnées et le rate limit de connexion.
- **Auth.js v5** (credentials + JWT).
- **Cloudinary** pour le stockage et les transformations d'images.
- **Vitest** pour les tests unitaires.

## 📋 Prérequis

- **Node.js 20.9 ou plus récent** (le projet est testé avec Node 22 ; `.nvmrc`
  est fourni).
- PostgreSQL.
- Un compte Cloudinary.

## 🚀 Installation

```bash
npm ci
cp .env.example .env.local
```

Renseigner `.env.local`, puis préparer la base :

```bash
psql "$POSTGRES_URL" -f db/schema.sql
```

Pour une base existante, lire [`db/README.md`](db/README.md) avant toute
migration. La migration `001_picture_lists_to_jsonb.sql` ne concerne que les
anciennes colonnes texte ; ne pas la rejouer sur une base neuve.

Lancer ensuite :

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

## 🔐 Variables d'environnement

Le modèle complet est dans [`.env.example`](.env.example).

- `POSTGRES_URL` (ou `DATABASE_URL` en compatibilité) : connexion PostgreSQL.
- `POSTGRES_SSL=false` : utile pour un PostgreSQL local sans TLS.
- `AUTH_SECRET` : secret de signature des sessions. Générer avec
  `openssl rand -base64 32`. `NEXTAUTH_SECRET` reste accepté pour compatibilité.
- `NEXT_PUBLIC_SITE_URL` : URL publique utilisée par le sitemap, le RSS et les
  métadonnées.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` et
  `NEXT_PUBLIC_CLOUDINARY_API_KEY` : configuration publique Cloudinary.
- `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` : configuration serveur
  Cloudinary. Le secret ne doit jamais être préfixé par `NEXT_PUBLIC_`.
- `NEXT_PUBLIC_CLOUDINARY_MAX_UPLOAD_BYTES` : limite côté widget.

## 🗄️ Base de données

- `db/schema.sql` : schéma de départ pour une installation neuve.
- `db/migrations/001_picture_lists_to_jsonb.sql` : conversion historique des
  listes texte en JSONB.
- `db/migrations/002_login_attempts.sql` : table du rate limit partagé.

La table `login_attempts` est utilisée par le limiteur de connexion. Le code
retombe sur un compteur mémoire si elle n'est pas encore présente.

## 🧪 Scripts

```bash
npm run dev        # serveur de développement
npm run build      # build de production
npm start          # serveur de production
npm run lint       # ESLint
npm run typecheck  # TypeScript sans émission
npm test           # tests Vitest
npm run check      # typecheck + lint + tests
```

## 🖼️ Images et droits

Sauf mention contraire, toutes les photographies présentes sur ce dépôt et sur
le site sont la propriété exclusive de leur auteur. Merci de ne pas les
réutiliser ou les redistribuer sans autorisation préalable.

Le blocage du clic droit et l'overlay de la galerie sont une dissuasion
visuelle, pas un contrôle d'accès : une image affichée dans un navigateur reste
techniquement téléchargeable.
