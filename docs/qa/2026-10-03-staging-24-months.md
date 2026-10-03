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

Les corrections des KPI par période ont été déployées en staging au commit `48b8a0d`. Les tests locaux analytics backend (18), frontend (14) et TypeScript étaient passés avant déploiement.

## Validation après déploiement — 3 octobre 2026

Six contrôles API authentifiés ont réussi : périodes 1m, 3m et 1y, pour tous les départements puis Engineering. Le nombre de mois enregistrés correspond à la période ; le budget vaut le plafond mensuel actuel multiplié par sa durée ; le coût par utilisateur correspond aux dépenses divisées par les utilisateurs actifs distincts.

| Département | Période | Dépenses EUR | Utilisateurs actifs | Réponse ms |
|---|---|---:|---:|---:|
| Tous | 1 mois | 554 | 12 | 308 |
| Tous | 3 mois | 1647 | 16 | 262 |
| Tous | 12 mois | 3701 | 16 | 306 |
| Engineering | 1 mois | 80 | 3 | 267 |
| Engineering | 3 mois | 240 | 3 | 345 |
| Engineering | 12 mois | 410 | 3 | 356 |

Temps de bout en bout depuis le poste client, une mesure par cas : ce contrôle ne constitue pas un test de charge ni une mesure du temps SQL seul.

Contrôle navigateur après actualisation : 3 mois affiche 1647 EUR, 16 utilisateurs actifs et 102,94 EUR/utilisateur. Le passage à 12 mois affiche 3701 EUR, 16 utilisateurs et 231,31 EUR/utilisateur, avec 12/12 mois enregistrés. Les économies potentielles restent explicitement mensuelles et actuelles.

L’historisation des budgets et statuts nécessite encore une migration et l’alimentation des relevés, à traiter séparément. Aucun déploiement production réalisé lors de cette reprise.

## Complément local : quatrième KPI et cumul d’usage

- La quatrième carte devient « Spend Without Usage » : somme des coûts enregistrés des outils sans session positive sur toute la période. Une session sur la période exclut l’outil ; ce chiffre n’est pas une économie garantie. Une couverture de coûts incomplète donne une valeur indisponible.
- Le cumul d’usage est le nombre de couples outil/utilisateur distincts observés sur la période, au lieu du compteur actuel du catalogue.
- La carte utilisateurs affiche le nombre distinct et sa différence avec la période précédente, sans ratio mélangeant usage historique et comptes actuellement actifs.
- CSV aligné avec le nouveau KPI. Aucun changement Prisma nécessaire pour ces calculs.
- Vérification locale : 12 tests backend ciblés, 4 tests frontend de totaux/CSV ; TypeScript backend et frontend réussis.
- Ce complément n’a pas encore été déployé en staging. Les répartitions et insights du catalogue conservent leur portée actuelle, explicitée dans la page.
