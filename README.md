# Internal Tools API - Part 2

API de gestion et d’analyse des outils internes d’entreprise développée avec NestJS, PostgreSQL et Prisma.

Le projet permet :
- la gestion complète des outils internes ;
- le suivi des coûts ;
- l’analyse des usages ;
- le reporting analytics ;
- l’identification des optimisations et économies potentielles.

---

# Technologies

- Language: TypeScript
- Framework: NestJS
- Database: PostgreSQL
- ORM: Prisma
- API Documentation: Swagger/OpenAPI
- Containerization: Docker & Docker Compose
- Testing: Jest

---

# Quick Start

## 1. Cloner le projet

```bash
git clone git@github.com:figura01/alt-s3-j1-api-internal-tools-management-part-2.git
cd alt-s3-j1-api-internal-tools-management-part-2
```
## 2. Configurer les variables d’environnement
Depuis la racine du projet
```bash
cp .env.example .env
cd backend
cp .env.example .env
```

## 3. Variables d’environnement
### Racine du projet .env
Utilisé par Docker Compose :
```text
POSTGRES_USER=tools_user
POSTGRES_PASSWORD=tools_password
POSTGRES_DB=internal_tools

PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

### Backend .env
Utilisé par NestJS et prisma:
```
DATABASE_URL="postgresql://tools_user:tools_password@postgres:5432/internal_tools"
PORT=3000
NODE_ENV=development
```

## 4. Lancer l’application

Depuis la racine du projet :

docker compose up -d --build

### Accès application
API
http://localhost:3001

Swagger Documentation
http://localhost:3001/api/docs

Swagger permet :
- consulter tous les endpoints ;
- visualiser les schémas DTO ;
- tester les routes directement ;
- consulter les validations ;
- voir les erreurs HTTP possibles.

## Développement Local

### Installer les dépendances
```bash
cd backend
npm install
```

### Générer le client Prisma
```bash
npx prisma generate
```

### Lancer le serveur NestJS
```bash
npm run start:dev
```

## pgAdmin

### Connexion pgAdmin

http://localhost:8081

### Credentials :

Email    : admin@example.com
Password : admin

### Ajouter le serveur PostgreSQL
- Onglet General:
Name: Internal Tools DB

- Onglet Connection:
Host name/address: postgres
Port: 5432
Maintenance database: internal_tools
Username: tools_user
Password: tools_password

## Architecture Backend

Le projet est construit avec une architecture modulaire basée sur NestJS afin de garantir :
- la séparation des responsabilités
- la maintenabilité ;
- la scalabilité ;
- la réutilisation du code.


## Structure du projet
backend/src/
├── analytics/
├── tools/
├── prisma/
├── common/
├── app.module.ts
└── main.ts


## Modules principaux

### analytics/

Contient toute la logique métier liée aux analytics :
- calculs de coûts
- agrégations
- reporting
- insights métier
- analytics endpoints.

### Organisation :
- controller ;
- service ;
- DTO ;
- types ;
- logique métier analytics.

### tools/

Gestion complète des outils internes :
- CRUD Tools
- filtres
- pagination
- tri
- validation des données

### Organisation :

- controller
- service ;
- DTO ;
- logique métier Tools
- prisma/

## Gestion de PostgreSQL via Prisma :

- PrismaService
- PrismaModule
- accès type-safe à la base de données.
- common/

Contient les éléments réutilisables :

- filtres d’erreurs ;
- utilitaires ;
- helpers globaux ;
- configuration partagée.


## Choix techniques
### NestJS

Choisi pour :
- l’architecture modulaire
- l’injection de dépendances ;
- la validation DTO ;
- l’intégration Swagger ;
- la maintenabilité.

### Prisma ORM

Choisi pour :

- le typage TypeScript fort ;
- les requêtes SQL propres ;
- l’intégration PostgreSQL ;
- la sécurité des accès DB.

### PostgreSQL

Choisi pour :

- les capacités d’agrégation SQL ;
- les analytics complexes ;
- les performances ;
- la robustesse relationnelle.

### Docker

Utilisé pour :

- simplifier le setup
- standardiser l’environnement
- faciliter le lancement du projet.

## API Endpoints
Tools API
GET /api/tools

Liste des outils avec :

- filtres
- pagination ;
- tri ;
- recherche avancée.
- Query params supportés
- department
- status
- category
- min_cost
- max_cost
- page
- limit
- sort_by
- sort_order

GET /api/tools/:id

Récupération d’un outil spécifique.

POST /api/tools

Création d’un nouvel outil.

Validation DTO :

nom ;
catégorie ;
coût ;
département ;
statut ;
URL.
PATCH /api/tools/:id

Mise à jour partielle d’un outil.

DELETE /api/tools/:id

Suppression d’un outil.

Analytics API

Tous les analytics incluent uniquement les outils avec :

status = 'active'
GET /api/analytics/department-costs

Analytics de répartition des coûts par département.

Fonctionnalités :

total des coûts ;
pourcentage budget ;
coût moyen par outil ;
insights départementaux.
GET /api/analytics/expensive-tools

Analyse des outils les plus coûteux.

Fonctionnalités :

coût par utilisateur ;
efficiency ratings ;
économies potentielles ;
outils les plus chers.
Query params
limit
min_cost
GET /api/analytics/tools-by-category

Répartition des outils par catégorie.

Fonctionnalités :

budget par catégorie ;
nombre d’outils ;
utilisateurs totaux ;
coût moyen utilisateur.
GET /api/analytics/low-usage-tools

Détection des outils sous-utilisés.

Fonctionnalités :

warning levels ;
recommandations ;
économies potentielles ;
projection annuelle.
Query params
max_users
GET /api/analytics/vendor-summary

Analyse des vendors/fournisseurs.

Fonctionnalités :

coût vendor ;
efficacité vendor ;
couverture départements ;
opportunités de consolidation.
Fonctionnalités Implémentées
Gestion des outils internes
CRUD complet ;
validation DTO ;
filtres avancés ;
pagination ;
tri ;
gestion des erreurs.
Analytics & Reporting
analytics département ;
analytics catégories ;
analytics vendors ;
outils coûteux ;
outils sous-utilisés ;
détection économies potentielles ;
insights métier.
Business Logic

Implémenté :

gestion division par zéro ;
arrondis cohérents ;
calculs pourcentages ;
efficiency ratings ;
warning levels ;
projections financières ;
edge cases analytics.
Validation & Gestion d’erreurs

Implémenté :

Validation DTO ;
Validation query params ;
erreurs HTTP cohérentes ;
gestion des ressources inexistantes ;
gestion des paramètres invalides ;
gestion des edge cases analytics.
Swagger / OpenAPI

Documentation disponible via :

http://localhost:3001/api/docs

Inclut :

endpoints ;
schémas DTO ;
paramètres query ;
réponses ;
tests interactifs.


## Tests
Lancer les tests unitaires
```bash
cd backend
npm run test
```

### Tests implémentés
- tests unitaires Jest ;
- tests des contrôleurs ;
- tests des helpers analytics ;
- validation des calculs métier ;
- gestion des cas limites.
- Validation manuelle réalisée avec Swagger UI ;
- requêtes curl ;

### tests fonctionnels API.

Docker
Lancer les services
```bash
docker compose up -d --build
```
Arrêter les services
```bash
docker compose down
```
Voir les logs
```bash
docker compose logs -f
```