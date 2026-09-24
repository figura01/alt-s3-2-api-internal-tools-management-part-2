# Mise en production — 24 septembre 2026

## Déploiement

- Production : https://techcorp.laurent-vuillaume.ovh
- Staging : https://staging.techcorp.laurent-vuillaume.ovh
- Commit déployé : `cef5911`, identique sur le VPS et dans le dépôt local.
- CI GitHub : [exécution réussie](https://github.com/figura01/alt-s3-2-api-internal-tools-management-part-2/actions/runs/35856093531), jobs backend, frontend et parcours Chromium tous réussis.
- Déploiement avec `deploy/deploy-techcorp.sh production` ; 11 migrations appliquées.
- Production isolée du staging par projet Compose, volume PostgreSQL, réseau interne et secrets indépendants. Le réseau frontal Caddy reste partagé.
- Compte ADMIN ACTIVE `laurent@test.com`, département Administration. Mot de passe distinct du staging, conservé sur le Mac dans `.tmp/production-admin.json` (permissions 600, répertoire 700, ignoré par Git).
- Aucun seed de démonstration en production ; catalogue initial vide.
- Domaine ajouté au Caddyfile existant après validation de la configuration. Rechargement sans redémarrer Caddy.
- Ancien Caddyfile conservé dans `/srv/vps-infra/Caddyfile.before-techcorp-production-20260924`.

## Contrôles

- Production : page de connexion visible dans le navigateur en HTTPS.
- API publique de production : connexion 201, profil ADMIN 200, catalogue/Analytics/utilisateurs/notifications 200, renouvellement 201, déconnexion 201, accès au profil ensuite refusé 401.
- Cookies de session et de renouvellement Secure et HttpOnly ; certificats HTTPS vérifiés.
- Caddy peut joindre les services frontend et API de production ; PostgreSQL sain.
- Production, staging, portfolio et test-projet-1 répondent chacun 200 en HTTPS.
- Staging : création, modification et suppression d'un outil temporaire par HTTPS ; catégorie temporaire supprimée également.
- Staging : transition EXPIRING produisant une seule notification, nouvelle modification sans doublon, état lu persisté.
- Staging : droits EMPLOYEE et MANAGER et refus d'un compte inactif vérifiés directement auprès de l'API dans son conteneur. Le compte temporaire a été supprimé. L'appel du domaine public depuis ce conteneur a échoué ; les tests HTTPS depuis le Mac ont réussi.
- Staging : connexion, tableau de bord, Analytics et déconnexion vérifiés dans le navigateur.
- Export CSV : bouton activé, mais le navigateur intégré n'a pas remonté l'événement de téléchargement. Réception manuelle du CSV non confirmée dans cette passe ; le scénario Chromium correspondant passe en CI.

## Sauvegardes et restauration

Deux sauvegardes PostgreSQL au format custom ont été restaurées avec succès dans des bases de contrôle séparées :

- `/home/ubuntu/backups/techcorp/staging-before-production-20260924.dump`
- `/home/ubuntu/backups/techcorp/production-initial-20260924.dump`

Les restaurations contenaient les 11 migrations et le compte administrateur. Les bases temporaires de contrôle ont ensuite été supprimées. Les sauvegardes sont conservées sur le VPS et copiées sur le Mac dans `.tmp/backups/`. La configuration secrète de production est aussi conservée localement dans `.tmp/backups/production.env`. Ces fichiers sont exclus de Git et accessibles au seul propriétaire.

Pour revenir sur l'exposition publique de production, restaurer le Caddyfile sauvegardé puis valider et recharger Caddy. Cette sauvegarde conserve les routes staging et des deux autres sites. Ne pas supprimer le volume PostgreSQL. Un retour à un ancien code nécessite de vérifier sa compatibilité avec les migrations ; ce premier déploiement n'a pas de version de production précédente.

## Ressources et limites

- Avant déploiement : 8 Go de disque disponibles.
- Après déploiement : environ 3 Go disponibles (85 % utilisés).
- Ajout de 2 Gio de swap dans `/swapfile-techcorp`, permissions 600 ; activation et entrée dans `/etc/fstab`. Ancien fstab conservé dans `/etc/fstab.before-techcorp-20260924`.
- Aucun nettoyage global d'images ou de volumes effectué.
- Les sauvegardes initiales décrites ci-dessus sont ponctuelles. Une sauvegarde quotidienne autonome a ensuite été installée : voir [procédure et limites](../deployment/backups.md). Aucune alerte externe automatique n'est configurée.
- Revoir la capacité disque avant une prochaine compilation sur le VPS.
