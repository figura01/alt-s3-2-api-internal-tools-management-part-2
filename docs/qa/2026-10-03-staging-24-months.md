# Historique fictif staging sur 24 mois

Exécution autorisée le 3 octobre 2026. Script : `deploy/demo/extend-staging-history.sql`.

- Sauvegarde préalable vérifiée : `/home/ubuntu/backups/techcorp/staging-before-24-months-20261003-150304.dump`.
- 120 relevés ajoutés : 240 relevés pour 10 outils, de novembre 2024 à octobre 2026.
- 868 usages simulés ajoutés aux mois sans usage par outil, en réutilisant exclusivement les 16 profils fictifs `demo-history-user-*`.
- Adoption progressive, quatre relevés mensuels par participant. Coûts nuls avant adoption. ArchiveBox reste sans usage depuis août 2026, OldMetrics depuis septembre 2026.
- Historique simulant une activité antérieure à l’import dans l’application ; les dates de création des comptes et outils restent inchangées.
- Aucun compte, mot de passe ou droit modifié. Aucun relevé existant remplacé. Seuls les nouveaux coûts v3 reçoivent un user_count et cost_per_user dérivés des logs.
- Réexécution en transaction annulée : zéro coût et zéro usage supplémentaires. Aucun usage futur. Coût catalogue actuel inchangé : 554 EUR.
- Taille totale de la base après ajout : 9319 kB, environ 9 MiB (pas la taille du seul ajout).
- Production inchangée.

## Limites et suite

Le schéma actuel conserve les coûts et usages, mais pas le budget, statut ou département historiques. Ces champs ne sont pas inventés par ce script. Le rattachement départemental utilise encore les relations actuelles.

Les corrections locales des KPI par période passent les tests analytics backend (18), frontend (14) et TypeScript, mais ne sont pas encore déployées. L’ajout de données seul ne modifie donc pas le comportement du sélecteur en staging. L’historisation des budgets et statuts nécessite une migration et l’alimentation des relevés, à traiter séparément.
