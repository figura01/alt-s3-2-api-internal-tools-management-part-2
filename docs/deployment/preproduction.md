# TechCorp sur le VPS existant

Staging et production déployés. Voir le [compte rendu du 24 septembre 2026](../qa/2026-09-24-production.md) pour les contrôles, sauvegardes et limites constatées. Les instructions ci-dessous restent la procédure de déploiement :

| Environnement | Domaine | Projet Compose | Fichier |
| --- | --- | --- | --- |
| Production | techcorp.laurent-vuillaume.ovh | techcorp-production | compose.production.yml |
| Staging | staging.techcorp.laurent-vuillaume.ovh | techcorp-staging | compose.staging.yml |

Caddy continue de gérer seul HTTPS et les ports 80/443 dans `/srv/vps-infra`. Le portfolio et test-projet-1 conservent leurs services et leur script de déploiement. Aucun Nginx supplémentaire n’est nécessaire.

Chaque environnement dispose de son volume PostgreSQL, de son réseau interne et de secrets indépendants. Seuls les services frontend et API rejoignent le réseau existant de Caddy, avec des noms distincts. Aucun port TechCorp ni PostgreSQL n’est publié sur le VPS. Le réseau web est partagé avec les autres projets : il ne constitue pas une isolation entre les services applicatifs. Les bases sont sur des réseaux internes séparés.

## Préparation sur le VPS (à effectuer ultérieurement)

1. Placer ce dépôt dans `/srv/apps/techcorp` et sélectionner un commit validé par la CI. Le script ne fait pas de `git pull` implicite.
2. Repérer le nom réel du réseau Caddy :

   ```sh
   docker inspect caddy --format '{{json .NetworkSettings.Networks}}'
   ```

   La clé Compose `web` peut correspondre à un réseau nommé `vps-infra_web`. Renseigner le nom observé ; ne pas créer un second réseau portant simplement le nom `web`.
3. Copier les modèles `docs/deployment/staging.env.example` et `production.env.example` vers `.env.staging` et `.env.production` à la racine. Renseigner `CADDY_WEB_NETWORK` dans chacun. Générer quatre secrets indépendants avec `openssl rand -hex 32` : un mot de passe PostgreSQL et un secret JWT par environnement. Conserver le format hexadécimal du mot de passe, inséré dans l’URL PostgreSQL. Restreindre les permissions de ces fichiers (`chmod 600`). Ils sont ignorés par Git et exclus des images Docker.
4. Préparer les enregistrements DNS des deux noms vers le VPS (ne créer un AAAA que si IPv6 fonctionne). Les certificats seront gérés par Caddy au déploiement.

## Déployer un environnement

Depuis `/srv/apps/techcorp`, après sauvegarde de la base existante :

```sh
./deploy/deploy-techcorp.sh staging
# Puis, après validation du staging :
./deploy/deploy-techcorp.sh production
```

Ce script construit les images **sur le VPS** à partir du commit sélectionné : aucune publication GHCR TechCorp n’existe encore. Prévoir les ressources et le temps nécessaires à la compilation Next.js. Le build nécessite le réseau (npm, Google Fonts). Les URL publiques sont figées dans chaque image frontend ; les deux environnements doivent donc avoir des images frontend distinctes.

Le script valide la configuration, construit les images, démarre PostgreSQL, applique les migrations Prisma puis met à jour uniquement les services de l’environnement sélectionné. Il s’arrête si la migration échoue. Il ne redémarre ni Caddy ni le portfolio et ne supprime aucune image ou aucun volume. Les migrations sont compatibles avec Prisma 6 verrouillé dans le dépôt. Aucun seed de démonstration n’est lancé. La création du premier administrateur reste une opération distincte à prévoir avant l’ouverture.

Le profil `operations` réserve le service de migration au script. Ne pas remplacer ce script par un simple `docker compose up`, qui ne garantit pas l’application des migrations avant la mise à jour.

## Ajouter les routes Caddy

Après démarrage des services, ajouter les blocs de `deploy/Caddyfile.techcorp` au Caddyfile existant. Ne pas remplacer les blocs du portfolio ou de test-projet-1. On peut activer seulement le bloc staging dans un premier temps.

Depuis `/srv/vps-infra` :

```sh
docker compose exec -T caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Les routes `/api` et `/api/*` vont vers NestJS en conservant leur préfixe ; le reste va vers Next.js. Les cookies HttpOnly/Secure restent limités à leur hôte (aucun domaine parent partagé), et chaque API n’accepte que l’origine de son environnement pour les mutations avec Origin. Le staging doit utiliser uniquement des données de test.

## Vérifier et revenir en arrière

Le script affiche les conteneurs mais cela ne suffit pas à valider le déploiement : vérifier les logs, `/login` en HTTPS, les ressources statiques, connexion/déconnexion et renouvellement de session, droits des rôles, outil jetable et export CSV. Vérifier aussi que le portfolio reste accessible. Les deux images tournent avec l’utilisateur non-root `node`.

Tester les sauvegardes et leur restauration avant une mise en production. Conserver le commit précédent et les images correspondantes. Un retour applicatif ne révoque pas les migrations SQL : vérifier la compatibilité avant de reconstruire le commit précédent. Ne jamais exécuter `down -v` sur une base à conserver. Ne pas réutiliser ou changer arbitrairement le mot de passe d’un volume déjà initialisé : une rotation PostgreSQL doit être coordonnée.

Les comptes, le DNS, les certificats et la validation HTTPS ne sont pas créés ou vérifiés par cette préparation locale.
