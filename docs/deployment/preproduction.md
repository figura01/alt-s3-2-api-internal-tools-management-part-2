# Préproduction : images et étapes de déploiement

Les images sont prêtes à être utilisées avec un hébergeur Docker. Aucun serveur, domaine, compte administrateur ni certificat n’est créé par ces fichiers. L’hébergement et le domaine doivent être choisis avant de déployer.

## Configuration requise

Prévoir une base PostgreSQL 15 dédiée, un secret JWT aléatoire et une origine HTTPS réservée à la préproduction. Ne pas réutiliser les données, identifiants ni comptes de démonstration du développement.

| Service | Variable | Valeur attendue |
| --- | --- | --- |
| API et migration | `DATABASE_URL` | URL PostgreSQL fournie par l’hébergeur |
| API | `JWT_SECRET` | Secret aléatoire conservé dans le gestionnaire de secrets |
| API | `JWT_EXPIRES_IN` | `15m` |
| API | `FRONTEND_ORIGIN` | Origine HTTPS exacte du frontend, sans slash final |
| API | `PORT` | `3000` par défaut |
| Frontend, compilation | `NEXT_PUBLIC_BASE_URL` | Origine HTTPS du frontend |
| Frontend, compilation | `NEXT_PUBLIC_API_URL` | URL publique de l’API, terminée par `/api` |
| Frontend, exécution | `API_URL` | URL de l’API accessible depuis le conteneur, terminée par `/api` |

Utiliser de préférence la même origine publique : `/api` vers l’API, toutes les autres routes vers le frontend. Le proxy doit préserver le préfixe `/api` et les en-têtes `Cookie` et `Set-Cookie`. Les cookies de production sont `Secure` et nécessitent HTTPS. PostgreSQL doit rester sur un réseau privé.

## Construire et démarrer

Depuis la racine, avec les variables publiques renseignées dans le shell :

```sh
docker build -f backend/Dockerfile.production --target migrate -t techcorp-migrate:staging backend
docker build -f backend/Dockerfile.production -t techcorp-api:staging backend
docker build -f frontend/Dockerfile.production \
  --build-arg NEXT_PUBLIC_BASE_URL="$STAGING_ORIGIN" \
  --build-arg NEXT_PUBLIC_API_URL="$STAGING_ORIGIN/api" \
  -t techcorp-frontend:staging frontend
```

Les URL publiques sont figées lors de la compilation : reconstruire le frontend en cas de changement de domaine. Le build télécharge la police Inter et nécessite un accès réseau. Les fichiers `.env` locaux et les dépendances locales sont exclus du contexte Docker.

Avant le premier démarrage et chaque mise à jour, lancer l’image `techcorp-migrate:staging` avec `DATABASE_URL` injectée par le gestionnaire de secrets. Attendre la réussite de `prisma migrate deploy`, puis démarrer les images API et frontend avec leurs variables respectives. Les images applicatives s’exécutent avec l’utilisateur `node`. Aucune migration ni aucun seed ne se lance implicitement au démarrage de l’application.

Ne pas lancer `prisma db seed` en préproduction : il contient des comptes de démonstration. La création du premier administrateur doit être effectuée séparément, pour un compte identifié, une fois l’environnement choisi.

## Vérifications avant ouverture

- Page `/login` accessible en HTTPS et chargement des ressources statiques réussi.
- Connexion et déconnexion ; cookies HttpOnly/Secure ; renouvellement de session.
- Accès ADMIN/MANAGER/EMPLOYEE conformes et refus des mutations sans en-tête CSRF.
- Création, modification, suppression d’un outil jetable et téléchargement CSV Analytics.
- Sauvegarde PostgreSQL et restauration testées ; conserver les images précédentes pour un retour applicatif. Un retour d’image n’annule pas une migration SQL : vérifier la compatibilité du schéma avant tout retour arrière.

La CI teste déjà les parcours sur Next.js compilé ; la vérification HTTPS sur l’environnement hébergé reste à effectuer après déploiement.

Références : [sortie standalone de Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [conteneurisation Next.js](https://docs.docker.com/guides/nextjs/).

## VPS hébergeant déjà le portfolio

`compose.staging.yml` crée un projet Docker distinct `techcorp-staging`, avec son propre réseau et volume PostgreSQL. Il n’écoute pas sur les ports 80/443 du portfolio. Seuls les ports loopback 3200 (frontend) et 3201 (API) sont publiés ; ils sont modifiables. PostgreSQL n’a aucun port publié.

Copier `docs/deployment/staging.env.example` vers `.env.staging`, choisir le sous-domaine HTTPS et générer deux secrets indépendants avec `openssl rand -hex 32`. Le mot de passe PostgreSQL doit être une valeur hexadécimale pour être utilisable directement dans l’URL de connexion. Vérifier la disponibilité des ports avant le lancement. Ne pas changer ce mot de passe après création du volume sans effectuer aussi sa rotation dans PostgreSQL.

Une fois le VPS et le proxy configurés, lancer explicitement :

```sh
docker compose --env-file .env.staging -f compose.staging.yml up -d --build
```

Compose attend PostgreSQL puis la réussite du conteneur de migration avant de démarrer l’API. Le proxy HTTPS existant devra transmettre `/api` (préfixe conservé) vers `127.0.0.1:3201` et le reste vers `127.0.0.1:3200`. S’il s’exécute lui-même dans Docker, l’intégration réseau doit être adaptée au proxy plutôt que d’utiliser ces adresses loopback. Ne pas ajouter de proxy concurrent ni modifier le site du portfolio. La configuration précise Nginx/Traefik/Caddy reste à déterminer avec celle du VPS.

Ce fichier prépare une préproduction. Pour une production ultérieure, utiliser un projet, des secrets, un domaine et des sauvegardes distincts. Ne pas exécuter `down -v` sur une base à conserver.
