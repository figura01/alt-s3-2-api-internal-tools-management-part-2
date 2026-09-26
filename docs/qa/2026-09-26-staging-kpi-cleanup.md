# Validation staging — mutualisation des KPI et des réponses outils

Date : 26 septembre 2026.
Version testée et déployée : `e144688eb0c211b514d648d52dda48a418185641`.
Environnement : https://staging.techcorp.laurent-vuillaume.ovh

## Changements

- Carte KPI commune au dashboard et aux analytics ; suppression de trois composants inutilisés.
- Mapping commun des réponses outils côté API, avec maintien du contrat propre à la création.

## Vérifications réussies

- Backend : 9 tests ciblés (mapper, service, contrôleur) et compilation.
- Frontend : 13 tests, TypeScript et lint ciblé.
- CI du commit : [exécution réussie](https://github.com/figura01/alt-s3-2-api-internal-tools-management-part-2/actions/runs/36236593207).
- Déploiement staging terminé ; base PostgreSQL saine.
- Régression HTTPS : modification de l’icône et du nombre d’utilisateurs, y compris zéro ; conservation des champs omis ; ajout exact de 30 centimes pour deux outils temporaires à 0,10 et 0,20 euro. Outils temporaires supprimés après le test.
- Inspection visuelle sur ordinateur : cartes et graphique affichés ; dashboard à 339 €, analytics à 339 € avec 49 € d’économies potentielles et 16 utilisateurs cumulés.
- Filtre Demo Engineering : 254 €, 49 € d’économies potentielles, 13 utilisateurs cumulés et 3 outils.
- Déconnexion de la session navigateur confirmée par retour à la page de connexion.
- Page de connexion production : HTTP 200.

## Protection et limites

Sauvegarde préalable staging : `/home/ubuntu/backups/techcorp/staging-before-e144688.dump`, inventaire vérifié avec `pg_restore --list`. Images de retour arrière conservées avec le tag `before-e144688`.

La production reste sur `04f59cf`. Cette validation ne comprend pas de nouvelle vérification mobile, de téléchargement CSV ni de restauration complète de la sauvegarde.

Espace disque VPS observé après déploiement : environ 2,2 Go disponibles (89 % utilisés). Aucun nettoyage effectué pendant cette validation.
