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

L’export reprend le département sélectionné et indique la date UTC, la devise d’affichage et la période du graphique. Le CSV utilise UTF-8 avec BOM, des virgules comme séparateurs et des nombres sans formatage monétaire. La période ne filtre pas les KPI ni les outils : ceux-ci représentent l’état courant. L’évolution des dépenses utilise uniquement les relevés enregistrés dans `cost_tracking`, filtrés par département. Les mois sans relevé restent vides dans le graphique et le CSV ; un coût enregistré à zéro reste égal à zéro. Les KPI sont recalculés côté API pour le département choisi ; seul le budget limite reste celui de l’entreprise. Les textes pouvant être interprétés comme des formules de tableur sont neutralisés.

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


### Périmètre et définition des KPI

`GET /api/analytics?department=Nom` applique le même périmètre aux outils, à l’historique des coûts et aux comptes. Sans paramètre, les KPI couvrent l’entreprise. Les utilisateurs actifs uniques sont les comptes ACTIVE ayant au moins un journal avec `sessionCount > 0` depuis le début du mois UTC ; chaque compte est compté une seule fois. Pour un département, le compte et l’outil utilisé doivent appartenir à ce département. Le total correspond aux comptes ACTIVE de ce périmètre. Le cumul des compteurs d’utilisateurs des outils est fourni séparément (`cumulative_tool_users`).

Le coût par utilisateur est le coût catalogue courant divisé par les utilisateurs uniques observés ce mois-ci. La comparaison utilise les relevés du mois précédent et ses utilisateurs uniques, sur le mois entier : elle n’est pas une comparaison à durée égale. Les valeurs historiques manquantes, les variations sur une base nulle et les coûts par utilisateur sans utilisateur observé sont `null` (— à l’écran, cellule vide dans le CSV). Les variations d’outils et de départements restent indisponibles faute d’historique. La variation budgétaire n’est calculée que si tous les outils du périmètre créés avant le mois courant disposent d’un relevé précédent. Les rattachements départementaux et statuts de compte sont les valeurs actuelles.


## Intégration continue

Le workflow `.github/workflows/ci.yml` s’exécute à chaque push, pull request et lancement manuel. Il utilise Node.js 22 et `npm ci` avec les lockfiles de chaque application, selon le [workflow Node.js recommandé par GitHub](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs).

- Backend : validation et génération Prisma, application de toutes les migrations sur PostgreSQL 15 vide, tests Jest, test SQL de collecte sur tables temporaires et compilation NestJS.
- Frontend : `npm test` (sessions, historique/CSV et cache), lint complet et build Next.js incluant la vérification TypeScript.

La base CI est éphémère ; les identifiants du workflow sont uniquement ceux de cette base de test. Aucun secret de production n’est requis. Le build frontend télécharge Inter via Google Fonts et nécessite un accès réseau. Les avertissements de lint ne bloquent pas la CI, les erreurs oui. Le lint backend historique n’est pas encore un contrôle CI ; les tests et la compilation backend le sont.

Ces contrôles ne déploient pas l’application. Une protection de branche exigeant leur réussite devra être activée séparément dans les paramètres GitHub si souhaitée.

### Tests de bout en bout

Le job `Browser journeys (Chromium)` lance de vrais parcours navigateur avec Next.js, NestJS et une base PostgreSQL dédiée : connexion invalide/valide, cookies HttpOnly, rechargement, déconnexion et révocation serveur, JWT expiré et renouvellement, accès MANAGER/EMPLOYEE, création/modification/suppression ADMIN et téléchargement CSV contenant les données réelles.

Pour les lancer localement, installer les dépendances des deux applications puis :

```sh
docker compose -f compose.e2e.yml up -d --wait
cd frontend
npx playwright install chromium
E2E_DATABASE_URL=postgresql://e2e:e2e@localhost:55432/internal_tools_e2e npm run test:e2e
```

Les ports 3100 et 3101 doivent être libres. Playwright démarre et arrête ses propres serveurs (Next.js compilé en mode production avant le lancement des scénarios). Les variables frontend nécessaires sont définies par Playwright, sans dépendre d’un fichier `.env` local. Le suffixe `_e2e` de la base est obligatoire. Les migrations et fixtures déterministes sont préparées automatiquement ; ne jamais fournir une base métier. Le PostgreSQL local utilise un stockage temporaire, sans volume persistant. Après les tests, depuis la racine : `docker compose -f compose.e2e.yml down`.

Chaque test dispose de cookies isolés ; aucun compte de développement n’est utilisé. Les rapports et traces d’échec sont conservés trois jours en CI et peuvent contenir les cookies des comptes de test. Les tests ne sont pas retentés automatiquement afin de rendre les échecs visibles. Configuration des serveurs : [documentation Playwright](https://playwright.dev/docs/test-webserver).

### Notifications personnelles

La cloche affiche le compteur réel de notifications non lues du compte connecté et disparaît pour les visiteurs déconnectés. La pastille est masquée à zéro (affichage `99+` au-delà de 99). La liste est paginée par 20 et actualisée à l’ouverture, au retour sur la fenêtre et toutes les 60 secondes. Lire une notification reste une action explicite via « Mark as read » ou « Mark all as read » ; ouvrir la liste ne marque rien automatiquement.

Les routes authentifiées `GET /api/notifications?offset=0`, `PATCH /api/notifications/:id/read` et `PATCH /api/notifications/read-all` limitent toutes leurs opérations au compte de la session, quel que soit son rôle. L’état lu est conservé en PostgreSQL. Appliquer la migration `20260923000000_add_notifications` avant de démarrer la nouvelle API.

Les admins et managers ACTIVE reçoivent désormais les alertes automatiques, à l’échelle de l’entreprise : passage d’un outil vers EXPIRING et seuils de 90 % / 100 % du budget catalogue mensuel (30 000, même référence qu’Analytics, tous statuts d’outils inclus). Les notifications comportent un type, un lien interne et une clé d’événement unique par destinataire. Les employés ne reçoivent pas ces alertes de gestion.

Une transition vers EXPIRING produit une alerte ; modifier un outil déjà EXPIRING n’en produit pas. Repasser par un autre statut puis revenir à EXPIRING constitue un nouveau renouvellement. Les outils déjà EXPIRING lors du déploiement ne génèrent pas de rattrapage. Le lien conserve l’identifiant historique ; si l’outil est supprimé, sa page indique qu’il n’existe plus.

Le budget est évalué après chaque mutation API d’un outil, au démarrage et chaque heure. Au premier constat d’un seuil atteint ou dépassé, une notification est créée par destinataire, seuil et mois UTC. Un saut direct au-dessus de 100 % crée les deux alertes. Les baisses puis remontées du budget, lectures, redémarrages et exécutions concurrentes ne recréent pas ces notifications. Si le montant reste élevé au mois suivant, de nouvelles alertes mensuelles sont émises au prochain contrôle. Les nouveaux responsables actifs reçoivent les seuils applicables au prochain contrôle. La modification de l’outil et ses notifications sont transactionnelles ; en cas d’échec, la mutation est annulée. Les changements directs en base ne déclenchent pas les alertes de renouvellement.

Appliquer également `20260923010000_notification_events`. Les anciennes notifications conservent le type GENERAL et leur état de lecture. Les emails et notifications de demandes d’accès ne sont pas implémentés.
