# 🌌 Circumpolar

> Portfolio web dédié à l'astrophotographie personnelle du ciel profond et du système solaire.

🌐 **Site en ligne** : [circumpolar.dpdns.org](https://circumpolar.dpdns.org)

---

## ✨ Fonctionnalités

- **Galerie interactive** : Affichage des captures astronomiques
- **Détails techniques complets** : Métadonnées d'acquisition par cible (optique, capteur, monture, temps d'intégration, filtres, logiciel de traitement)
- **Navigation fluide** : Affichage dynamique sous forme de modales avec interception de routes Next.js

---

## 🛠️ Stack Technique

- **Framework** : [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Langage** : TypeScript
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Hébergement & CDN Médias** : [Cloudinary](https://cloudinary.com/) (stockage optimisé, transformations dynamiques)
- **Base de données** : PostgreSQL (stockage des métadonnées d'acquisition)
- **Authentification** : [NextAuth.js v5 / Auth.js](https://authjs.dev/) (credentials + JWT session)

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js (v18+)
- `pnpm`, `npm` ou `yarn`
- Une base de données PostgreSQL
- Un compte Cloudinary

### 1. Cloner le dépôt

```bash
git clone https://github.com/noctyris/circumpolar.git
cd circumpolar
```

### 2. Installer les dépendances

```bash
npm install
# ou
pnpm install
```

### 3. Configurer les variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/circumpolar

# NextAuth
AUTH_SECRET=ton_secret_genere_via_openssl

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=circumpolar
CLOUDINARY_API_KEY=ta_cle_api
CLOUDINARY_API_SECRET=ton_secret_api
```

### 4. Lancer le serveur de développement

```bash
npm run dev
# ou
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

---

## 📸 Structure des Données

Chaque capture répertorie les caractéristiques d'acquisition essentielles :
- **Cible** : Désignation astronomique (Messier, NGC, IC) & catégorie
- **Matériel** : Tube/optique, caméra, monture, accessoires
- **Exposition** : Temps de pose unitaire, nombre de brutes, filtres, temps total d'intégration
-# 🌌 Circumpolar

> Galerie et carnet de bord d'astrophotographie personnelle.

Circumpolar est un espace dédié à l'observation du ciel nocturne. La plateforme rassemble des clichés astronomiques (nébuleuses, galaxies, amas stellaires, planètes) accompagnés de leurs fiches d'observation complètes.

---

## ✨ Ce que vous trouverez sur le site

* **Galerie d'astrophotographie** : Consultation des images en haute définition réparties par cibles (ciel profond, planétaire, etc.).
* **Fiches techniques détaillées** : Pour chaque image, accès aux conditions de prise de vue réelles :
  * Matériel utilisé (télescope, caméra, monture, filtres).
  * Données d'acquisition (temps de pose unitaire, nombre de poses, temps d'intégration total).
  * Date, lieu et qualité du ciel (indice Bortle).
* **Versions annotées** : Mise en évidence des objets célestes identifiés sur le champ photographié quand l'astrométrie est disponible.

---

## 🔭 Le Matériel Principal

Les photographies présentées sont principalement capturées avec :
* **Optique** : Télescope Perl Bellatrix Newton 150/750
* **Monture** : SynScan EQ3 motorisée
* **Caméras** : Caméras dédiées à l'astronomie (ex. ZWO ASI)

---

## 🌐 Découvrir les images

Le site est accessible en ligne à l'adresse suivante :  
👉 **[circumpolar.dpdns.org](https://circumpolar.dpdns.org)**

---

## 📄 Licence et Droits d'auteur

Sauf mention contraire, toutes les photographies présentes sur ce dépôt et sur le site sont la propriété exclusive de leur auteur. Merci de ne pas les réutiliser ou les redistribuer sans autorisation préalable.
 **Conditions** : Date de capture, coordonnées (RA/Dec), classe Bortle
