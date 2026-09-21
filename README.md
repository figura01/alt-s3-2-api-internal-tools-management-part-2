# TechCorp — Internal Tools Management

**Centraliser les outils SaaS d’une entreprise, suivre leurs coûts et mieux comprendre leurs usages.**

TechCorp est une application web full stack de gestion des outils internes. Elle réunit un catalogue de logiciels, un tableau de bord budgétaire et des analyses de dépenses pour aider les équipes à identifier les outils coûteux, sous-utilisés ou arrivant à expiration.

Le projet associe une interface **Next.js / React** à une API **NestJS**, avec **PostgreSQL** et **Prisma** pour la persistance des données.

## Aperçu

![Aperçu du tableau de bord TechCorp : budget mensuel, outils actifs, départements, coût par utilisateur et catalogue récent](docs/images/dashboard.png)

*Capture de l’application exécutée avec Docker Compose, réalisée le 18 septembre 2026.*

## Fonctionnalités phares

### Catalogue des outils

- Création, consultation, modification et suppression des outils.
- Recherche, filtres par département, catégorie et statut, tri et pagination.
- Suivi du fournisseur, du coût mensuel et du nombre d’utilisateurs actifs.
- Pages de détail et formulaires de gestion des outils.

### Tableaux de bord et Analytics

- Synthèse du budget mensuel, des outils actifs, des départements et du coût par utilisateur.
- Répartition des dépenses par département et classements des outils les plus coûteux.
- Comparaison des outils les plus et les moins utilisés.
- Identification des outils inutilisés, des échéances et des économies potentielles.
- Filtrage des données Analytics par département.
- Export CSV des Analytics : indicateurs, coûts par département, classements, outils et opportunités, depuis le bouton **Export CSV** (MANAGER et ADMIN).
- API d’analyse complémentaire par catégorie et par fournisseur.

Les KPI restent numériques dans les données. Le formatage intervient à l’affichage : montants à deux décimales, pourcentages à deux décimales maximum et signes explicites pour les variations. La locale et la devise sont centralisées dans Zustand ; changer la devise de formatage ne réalise pas une conversion monétaire.

L’export reprend le département sélectionné et indique la date UTC, la devise d’affichage et la période du graphique. Le CSV utilise UTF-8 avec BOM, des virgules comme séparateurs et des nombres sans formatage monétaire. La période ne filtre pas les KPI ni les outils : ceux-ci représentent l’état courant. L’évolution des dépenses utilise uniquement les relevés enregistrés dans `cost_tracking`, filtrés par département. Les mois sans relevé restent vides dans le graphique et le CSV ; un coût enregistré à zéro reste égal à zéro. Les tendances KPI, le budget limite et le total d’utilisateurs restent globaux lors du filtrage par département. Les textes pouvant être interprétés comme des formules de tableur sont neutralisés.

### Authentification et API

- Inscription, connexion et récupération du profil authentifié.
- Authentification JWT avec Passport et hachage des mots de passe avec Argon2.
- Validation des entrées avec des DTO NestJS.
- Documentation interactive Swagger / OpenAPI.

## Stack technique

| Couche | Technologies | Rôle |
| --- | --- | --- |
| Langage | TypeScript | Typage du frontend, de l’API et des contrats de données |
| Frontend | Next.js 15, React 19 | App Router, pages serveur et composants interactifs |
| Interface | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide | Composants, styles et icônes |
| État et données | Zustand, TanStack Query, TanStack Table | État partagé, requêtes et tableaux |
| Formulaires | React Hook Form, Zod | Saisie et validation côté client |
| Visualisation | Recharts | Graphiques Analytics |
| Backend | NestJS 11 | API REST organisée en modules métier |
| Base de données | PostgreSQL 15, Prisma 6 | Modèle relationnel, migrations et accès aux données |
| Authentification | JWT, Passport, Argon2 | Sessions par jeton et hachage des mots de passe |
| Documentation | Swagger / OpenAPI | Exploration des routes et schémas de l’API |
| Qualité | Jest, ESLint, Prettier | Tests backend, analyse statique et formatage |
| Environnement | Docker Compose, Node.js 20, pgAdmin | Services de développement et administration PostgreSQL |

## Architecture

```text
frontend/                  Application Next.js
  src/app/                 Pages : Dashboard, Tools, Analytics, Settings
  src/components/          Composants UI et composants métier
  src/services/            Appels à l’API
  src/store/               État global Zustand
  src/types/               Contrats TypeScript
  src/utils/               Calculs, filtres et formatage
backend/                   API NestJS
  src/analytics/           Indicateurs et analyses de coûts
  src/auth/                Authentification
  src/tools/               Gestion du catalogue
  src/categories/          Catégories d’outils
  src/departments/         Départements
  src/prisma/              Accès à la base
  src/common/              Validation et gestion des erreurs
  prisma/                  Schéma, migrations et données de démonstration
data/postgres/             Script SQL historique
docs/images/               Visuels du README
docker-compose.yml         Services de développement
```

Le schéma Prisma modélise notamment les utilisateurs, départements, catégories, outils, accès aux outils, demandes d’accès, journaux d’usage et suivis de coûts. La présence d’un modèle ne signifie pas qu’un écran de gestion est déjà disponible pour chacun.

## Installation et démarrage

### Prérequis

- Git et Docker avec Docker Compose.
- Node.js et npm pour travailler hors des conteneurs ; les Dockerfiles utilisent Node.js 20.

### 1. Récupérer le projet

```bash
git clone git@github.com:figura01/alt-s3-2-api-internal-tools-management-part-2.git
cd alt-s3-2-api-internal-tools-management-part-2
```

### 2. Configurer l’environnement

Les modèles sont nommés `.env.exemple` dans ce dépôt. Copier les fichiers uniquement s’ils n’existent pas déjà :

```bash
cp -n .env.exemple .env
cp -n backend/.env.exemple backend/.env
cp -n frontend/.env.exemple frontend/.env
```

Dans le `.env` racine, renseigner `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB`. Le modèle contient une première ligne isolée `.env.example` : la retirer du fichier copié.

Dans `backend/.env`, utiliser les mêmes identifiants PostgreSQL et définir un secret JWT personnel :

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@postgres:5432/internal_tools"
PORT=3000
NODE_ENV=development
JWT_SECRET="REMPLACER_PAR_UN_SECRET_ALEATOIRE"
JWT_EXPIRES_IN=1d
FRONTEND_ORIGIN=http://localhost:3000
```

Dans `frontend/.env`, distinguer l’adresse utilisée dans le conteneur Next.js de celle utilisée par le navigateur :

```dotenv
API_URL=http://api:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=TechCorp
NEXT_PUBLIC_APP_DESCRIPTION=Gestion des outils internes et des coûts SaaS
```

`API_URL` doit être ajouté au modèle frontend. Les fichiers `.env` restent locaux et ne doivent pas être publiés.

### 3. Préparer la base de données

**Pour une nouvelle installation**, retirer du service `postgres` dans `docker-compose.yml` le montage suivant avant son premier démarrage :

```yaml
- ./data/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

Ce script correspond à un ancien modèle SQL. Le schéma actuel est géré par les migrations Prisma. Pour une base existante contenant des données à conserver, vérifier son état avant toute migration ; ne pas réinitialiser son volume.

Sur une base neuve destinée à ce projet :

```bash
docker compose up -d postgres
docker compose build api frontend
docker compose run --rm api npx prisma migrate deploy
docker compose run --rm api npx prisma db seed
docker compose up -d
```

Le seed peuple la base avec des données de démonstration. La génération du client Prisma est exécutée pendant la construction de l’image backend.

### 4. Accéder aux services

| Service | Adresse |
| --- | --- |
| Application | http://localhost:3000 |
| API REST | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| pgAdmin | http://localhost:8081 |

La configuration actuelle de pgAdmin utilise `admin@example.com` / `admin`, définis directement dans Docker Compose. Les variables pgAdmin présentes dans le modèle `.env` ne sont pas encore reliées au service. Depuis pgAdmin, l’hôte PostgreSQL est `postgres`, sur le port `5432`.

### Commandes utiles

```bash
# Suivre les logs
docker compose logs -f frontend api

# Arrêter les services en conservant les volumes
docker compose down

# Régénérer le client Prisma après une modification du schéma
docker compose exec api npx prisma generate
```

### Développement sans conteneurs applicatifs

Avec une base PostgreSQL disponible, utiliser `localhost` dans `DATABASE_URL`, `PORT=3001` pour NestJS et `API_URL=http://localhost:3001/api` pour Next.js.

Dans deux terminaux distincts :

```bash
# Backend
cd backend
npm ci
npx prisma generate
npm run start:dev
```

```bash
# Frontend
cd frontend
npm ci
npm run dev
```

## Principales routes API

Toutes les routes ci-dessous sont préfixées par `/api`.

| Méthode | Route | Fonction |
| --- | --- | --- |
| GET | `/tools` | Recherche, filtres, tri et pagination |
| GET | `/tools/:id` | Détail d’un outil |
| POST | `/tools` | Création d’un outil |
| PATCH | `/tools/:id` | Modification d’un outil |
| DELETE | `/tools/:id` | Suppression d’un outil |
| GET | `/departments` | Liste des départements |
| GET | `/categories` | Liste des catégories |
| GET | `/analytics` | KPI et synthèse budgétaire |
| GET | `/analytics/department-costs` | Coûts par département |
| GET | `/analytics/expensive-tools` | Outils les plus coûteux |
| GET | `/analytics/tools-by-category` | Analyse par catégorie |
| GET | `/analytics/low-usage-tools` | Outils sous-utilisés |
| GET | `/analytics/vendor-summary` | Synthèse par fournisseur |
| POST | `/auth/register` | Inscription |
| POST | `/auth/login` | Connexion |
| GET | `/auth/me` | Profil authentifié, avec cookie HttpOnly |

La liste des outils accepte notamment `query`, `department`, `category`, `status`, `min_cost`, `max_cost`, `page`, `limit`, `sort_by` et `sort_order`. La taille d’une page est limitée à 100 éléments. Swagger détaille les paramètres et les validations.

## Vérifications

```bash
# Tests unitaires backend
cd backend
npm test -- --runInBand --watchman=false

# Tests ciblés Analytics
npm test -- analytics.service.spec.ts --runInBand --watchman=false
```

```bash
# Frontend
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

Ces commandes décrivent les vérifications disponibles ; elles ne constituent pas une garantie que toute la suite passe sur l’état courant. Un client Prisma désynchronisé doit être régénéré avant d’analyser les erreurs de types backend.

## État du projet et prochaines évolutions

Le projet est en cours de développement. Les prochaines étapes concernent notamment :

- La définition métier du taux d’adoption et la distinction entre utilisateurs uniques et usages cumulés par outil.
- L’historisation des variations du nombre d’outils et de départements, actuellement renvoyées à zéro faute d’historique exploité.
- La validation complète des KPI lors du filtrage par département.
- L’extension des préférences Settings à des paramètres métier partagés, si nécessaire.
- La résolution des incohérences de types restantes et l’élargissement des tests.

## Permissions des comptes

### Préférences d’affichage

La page `/settings`, réservée aux administrateurs, propose le thème clair, sombre ou système ainsi que le format régional et la devise d’affichage. Le thème s’applique immédiatement. Le format et la devise disposent d’un aperçu, d’un bouton de sauvegarde, d’une annulation et d’un retour aux valeurs par défaut (à sauvegarder). Ces préférences sont conservées dans le navigateur et restaurées au rechargement ; elles ne constituent pas des paramètres partagés de l’entreprise. La devise ne convertit pas les montants. La page donne également accès au profil et à la gestion des utilisateurs.

| Accès | EMPLOYEE | MANAGER | ADMIN |
| --- | --- | --- | --- |
| Consulter le catalogue et les fiches outils | Oui | Oui | Oui |
| Consulter les Analytics | Non | Oui | Oui |
| Créer, modifier et supprimer les outils | Non | Non | Oui |
| Modifier son prénom et son nom | Oui | Oui | Oui |

Les routes du catalogue exigent une session JWT. Les mutations des catégories et des départements sont également réservées aux administrateurs. La liste des départements reste publique pour le formulaire d’inscription.

Le backend relit le rôle et le statut du compte en base à chaque requête soumise aux permissions. Le frontend charge les données protégées depuis le navigateur, après restauration de la session. Le tableau de bord employé affiche les outils récents sans appeler les Analytics. Les nouvelles inscriptions reçoivent le rôle EMPLOYEE ; la modification du profil ne permet pas de changer de rôle.

### Gestion des utilisateurs

La page `/users`, réservée aux administrateurs, permet de rechercher les comptes et de modifier leur rôle ou leur statut. Les routes `GET /api/users` et `PATCH /api/users/:id` vérifient le rôle courant en base. Les réponses ne contiennent aucun mot de passe. Une transaction verrouille les comptes pendant les modifications de permissions afin de conserver au moins un administrateur actif, même lors de requêtes concurrentes. Les comptes inactifs ne peuvent plus se connecter ni accéder aux routes protégées.


### Sessions par cookie HttpOnly

La connexion et l’inscription installent le JWT dans le cookie `techcorp_session` (`HttpOnly`, `SameSite=Lax`, chemin `/api`, `Secure` en production). Le jeton d’accès expire après 15 minutes ; la session possède une limite absolue de 7 jours. La réponse JSON contient uniquement le profil ; Zustand ne conserve aucun jeton. Les anciens jetons localStorage sont supprimés au chargement : une reconnexion est nécessaire après la migration.

Le frontend utilise `credentials: include`. L’API extrait le JWT du cookie et ne prend plus en charge les anciens en-têtes Bearer. `POST /api/auth/logout` efface le cookie, y compris pour une session expirée. La déconnexion révoque la session en base avant d’effacer les deux cookies ; les jetons de cette session sont alors refusés à la prochaine requête, même s’ils ne sont pas expirés. Les autres sessions du compte restent ouvertes.

Le cookie `techcorp_refresh`, limité à `/api/auth`, contient un secret aléatoire de 256 bits dont seule l’empreinte SHA-256 est stockée dans `auth_sessions`. Il est HttpOnly, SameSite=Lax et Secure en production. `POST /api/auth/refresh` délivre un nouveau JWT de 15 minutes après vérification de la session et du statut du compte. Le secret de renouvellement reste stable jusqu’à déconnexion ou expiration absolue après 7 jours ; un renouvellement ne prolonge pas cette limite.

Sur une réponse 401 d’une route protégée, le frontend tente le renouvellement puis rejoue la requête une seule fois. Les requêtes simultanées d’un même onglet partagent le renouvellement. Les routes login/register/logout/refresh et les réponses 403 ne déclenchent pas ce mécanisme. Une panne réseau ou une erreur serveur n’est pas traitée comme une expiration de session. Le backend vérifie en base chaque session authentifiée.

Appliquer la migration `20260921000000_add_auth_sessions` et régénérer Prisma avant de démarrer cette version (`npx prisma migrate deploy`, puis `npx prisma generate`, depuis `backend/` ou dans le conteneur API). Les anciens JWT sans identifiant de session sont refusés : une reconnexion est nécessaire. Les durées actuelles sont définies dans `AuthService` (15 minutes / 7 jours) et remplacent la durée historique `JWT_EXPIRES_IN` pour les jetons de session.

Tests du renouvellement frontend : `cd frontend && node --test scripts/test-session-api.cjs`. Les tests backend couvrent les cookies, le renouvellement, la révocation et les permissions.

Les mutations, y compris login/register/logout/refresh, exigent `X-CSRF-Protection: 1`. Si l’en-tête `Origin` est présent, il doit correspondre exactement à `FRONTEND_ORIGIN`, également utilisé pour CORS (par défaut `http://localhost:3000`). Les clients API et outils de test doivent envoyer cet en-tête et conserver le cookie. Cette protection par en-tête personnalisé et origine explicite suit le modèle [OWASP pour les API AJAX](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#employing-custom-request-headers-for-ajaxapi).

En production, servir le frontend et l’API en HTTPS, sur le même site (par exemple `app.example.com` et `api.example.com`), et configurer `FRONTEND_ORIGIN` avec l’origine exacte du frontend, sans slash final. Le mode SameSite=Lax ne prend pas en charge un frontend et une API hébergés sur deux sites distincts. Les préférences d’affichage restent dans localStorage, indépendamment de l’authentification.


### Historique mensuel des dépenses

`GET /api/analytics/spend-history` (MANAGER et ADMIN) agrège les relevés `cost_tracking` des 12 derniers mois calendaires, mois courant inclus, par mois UTC et département. Le graphique propose le mois courant, les 3 derniers mois ou les 12 derniers mois. Le mois courant et les autres mois ne contenant qu’une partie des relevés peuvent être incomplets ; aucun montant manquant n’est estimé. Le rattachement se fait au département actuel de chaque outil, faute d’historisation des transferts. Les données chargées par le seed restent des données de démonstration.

Le filtre de période agit sur l’historique et son export, pas sur les KPI d’état courant. La collecte automatique complète les relevés manquants du mois courant au démarrage de l’API, puis chaque heure. Tests frontend : `cd frontend && node --test scripts/test-spend-history.cjs`.


### Collecte automatique des coûts

`MonthlyCostCollector` enregistre le coût mensuel catalogue, le nombre d’utilisateurs actifs et le coût par utilisateur (zéro si aucun utilisateur) pour chaque outil, quel que soit son statut, conformément au périmètre budgétaire du tableau de bord. Le mois est déterminé par l’horloge PostgreSQL en UTC.

Un seul relevé est conservé par outil et par mois : la première observation fait référence. Les modifications du catalogue intervenant ensuite dans le mois ne réécrivent pas ce relevé ; les coûts courants et historiques peuvent donc différer. Les relevés existants, y compris importés ou issus du seed, sont préservés. Le mécanisme représente des instantanés du catalogue, pas des factures ni un cumul de consommation réelle.

La collecte s’exécute au démarrage puis chaque heure tant que l’API fonctionne. Les nouveaux outils sont collectés au passage suivant. Les redémarrages et plusieurs instances concurrentes ne créent pas de doublons grâce à la contrainte unique PostgreSQL et à une insertion atomique. Les erreurs sont journalisées et une nouvelle tentative a lieu au passage suivant. Après une interruption, seul le mois courant est collecté ; les mois manquants ne sont pas reconstruits à partir des coûts actuels. Aucun service externe de planification n’est nécessaire.
