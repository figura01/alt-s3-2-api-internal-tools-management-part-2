# Validation staging — modifications des outils et montants

- Commit déployé : `4d5a61ce9da2e26057e3ab1befc3a82e04382796`.
- CI réussie : https://github.com/figura01/alt-s3-2-api-internal-tools-management-part-2/actions/runs/36039549562
- Sauvegarde PostgreSQL préalable vérifiée avec `pg_restore --list` : `/home/ubuntu/backups/techcorp/staging-before-4d5a61c.dump`.
- Anciennes images conservées : `techcorp-staging-api:before-4d5a61c` et `techcorp-staging-frontend:before-4d5a61c`.
- Déploiement staging terminé, aucune migration en attente. PostgreSQL sain.
- Tests HTTPS authentifiés : création de deux outils temporaires à 0,10 et 0,20 ; modification et relecture de l’icône, du nombre d’utilisateurs à 12 puis à zéro ; conservation des champs omis lors d’une modification du nom. Tous réussis.
- Total Analytics augmenté de 0,30, conformément aux outils de test.
- Générateur CSV exécuté localement sur les réponses réelles du staging : total et coût du département égaux à 0,30. Le téléchargement CSV dans le navigateur n’a pas été rejoué dans cette passe.
- Outils temporaires supprimés et session déconnectée après vérification.
- Production non redéployée ; page de connexion HTTP 200.
- Espace disque après compilation : 2,4 Go libres, 88 % utilisés. Aucun nettoyage d’images ou de volumes effectué.

Les corrections restent sur `codex/tool-updates-analytics-cents` ; aucune fusion ni mise en production effectuée dans cette passe.
