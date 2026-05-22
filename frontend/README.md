# Internal Tools Frontend

Frontend moderne SaaS développé avec Next.js 15, React 19, Tailwind CSS v4, shadcn/ui et TanStack Query pour la gestion d’un dashboard analytics autour de la gestion d’outils internes d’entreprise.

# Quick Start
## Installation
```bash 
    cd frontend && npm install
```

## Lancement du projet
Avec Docker a la racine du repo
```bash
docker compose up --build
```
Sans Docker
```bash
cd frontend && npm run dev
```

## Application disponible sur :

http://localhost:3000


## Configuration
Variables d’environnement

Créer :

frontend/.env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://api:3000/api
🏗️ Architecture

Le frontend repose sur une architecture modulaire orientée :

feature-driven ;
design-system ;
SSR + client caching ;
séparation UI / logique métier.

## Structure du projet
src/
│
├── app/
│   ├── analytics/
│   ├── tools/
│   └── dashboard/
│
├── components/
│   ├── dashboard/
│   ├── tools/
│   ├── analytics/
│   └── ui/
│
├── services/
│
├── hooks/
│
├── schemas/
│
├── types/
│
├── lib/
│
├── utils/
│
└── providers/

## Organisation
app/
Contient les pages Next.js App Router :
- Dashboard 
- Tools 
- Analytics

components/

Découpage :
- composants métiers ;
- composants UI ;
- wrappers design system.
- services/

Centralisation des appels API :
- fetch SSR ;
- mutations ;
- endpoints JSON server.

schemas/
Validation avec :
- Zod ;
- React Hook Form.
  
lib/
Infrastructure partagée :
- api.ts
- query-client.ts
- utils.ts
  
## Design System Evolution

Le design system a été construit progressivement autour de :
- shadcn/ui ;
- Tailwind CSS v4 ;
- variables CSS ;
- gradients personnalisés.

Philosophie
Objectifs :
- cohérence visuelle ;
- scalabilité ;
- réutilisabilité ;
- maintenance simple.
- Éléments clés

## Gradients
Création d’un système de gradients réutilisables :
- gradient-green
- gradient-blue
- gradient-orange
- gradient-pink
- Custom Components

Création de composants :
- CustomBadge
- CustomProgress
- ToolLogo

afin de conserver :
- cohérence ;
- accessibilité ;
- abstraction UI.

## Dark Mode
Gestion via :
next-themes
variables CSS
Tailwind CSS v4.

## Navigation & User Journey

Le flow utilisateur principal :

Dashboard
   ↓
Tools List
   ↓
Tool Details
   ↓
Edit Tool
   ↓
Analytics

## Dashboard

Vue synthétique :
- KPI ;
- coûts ;
- alertes ;
- outils récents.

Tools
- Gestion :
- listing ;
- recherche ;
- pagination ;
- édition ;
- création.

Analytics
Visualisation :
- coûts ;
- usage ;
- catégories ;
- tendances.


## Data Integration Strategy

Le frontend consomme un JSON server simulant une API SaaS.

Architecture des données
Frontend
   ↓
services/
   ↓
lib/api.ts
   ↓
JSON Server API

## SSR

Les pages principales utilisent :
- Server Components ;
- fetch serveur ;
- hydratation minimale.
- Client Caching

TanStack Query utilisé pour :
- mutations ;
- invalidation ;
- cache ;
- optimistic updates futures.

Typage
Types séparés :
- API DTO ;
- formulaires ;
- UI.

## Progressive Responsive Design

Approche :

- mobile-first ;
- progressive enhancement.

Breakpoints
Utilisation Tailwind :
- sm
- md
- lg
- xl

## Adaptation
Dashboard
- KPI responsive ;
- stack mobile ;
- grid desktop.
- Data Tables
- scroll horizontal mobile ;
- pagination adaptative.
- Forms
- mono-colonne mobile ;
- bi-colonne desktop.

## Testing Strategy

Stratégie prévue :
- Unit Tests

Technologies :
- Vitest ;
- React Testing Library.
- Tests ciblés
- services ;
- utils ;
- validation Zod ;
- composants UI critiques.

## QA

Checklist :
- responsive ;
- dark mode ;
- loading states ;
- empty states ;
- fallback images ;
- erreurs réseau.

## Performance Optimizations

Optimisations appliquées :
- SSR
- Réduction du JS client :
- fetch serveur ;
- rendu initial rapide.
- Parallel Fetching

Utilisation de :
- Promise.all()
pour :
- analytics ;
- tools ;
- departments.
- Image Handling

Gestion :
- fallback images ;
- lazy loading ;
- optimisation Next/Image.
- Data Fetching

Centralisation via :
- lib/api.ts

afin de :
- mutualiser ;
- simplifier ;
- préparer auth/token refresh.

Design Consistency Approach
La cohérence a été maintenue grâce à :

- Tokens visuels
- gradients ;
- radius ;
- spacing ;
- shadows ;
- variables CSS.
- Composants abstraits

Création de :
- CustomBadge
- CustomProgress
- GlassCard

Naming Convention
Uniformisation :

- variants ;
- status ;
- couleurs ;
- composants.

## Data Visualization Philosophy

Objectif :
- lisibilité ;
- minimalisme ;
- dashboard SaaS moderne.

## Charts

Prévu avec :
- Recharts ;
- intégration Tailwind/shadcn.

Philosophie graphique
Favoriser :
- KPI simples ;
- micro-interactions ;
- gradients subtils ;
- faible charge cognitive.

Progress Bars
Création d’un composant custom :
- gradients ;
- pill shape ;
- labels intégrés.
- 
🔮 Next Steps / Complete App Vision

Évolutions envisagées :
- Authentification
- JWT ;
- RBAC ;
- multi-tenant.
- Real Backend

Migration :
JSON Server
→ NestJS + Prisma.

Analytics avancées
- dépenses par équipe ;
- forecasting ;
- AI insights ;
- alerting.


Collaboration
- commentaires ;
- approval workflow ;
- audit logs.

Monitoring
- Sentry ;
- logs ;
- analytics produit.

UX
- drag & drop ;
- animations Framer Motion ;
- onboarding ;
- keyboard navigation.

Stack Technique
Technologie	Usage
- Next.js 15	Framework
- React 19	UI
- Tailwind CSS v4	Styling
- shadcn/ui	Design System
- TanStack Query	Data Fetching
- React Hook Form	Forms
- Zod	Validation
- Docker	Containerisation
- TypeScript	Typage
- JSON Server	Mock API