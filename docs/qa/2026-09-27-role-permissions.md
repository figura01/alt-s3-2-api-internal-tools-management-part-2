# Vérification des permissions — 27 septembre 2026

## Matrice observée côté API

| Action | Anonyme | Employé | Manager | Administrateur |
| --- | --- | --- | --- | --- |
| Catalogue, catégories | 401 | Autorisé | Autorisé | Autorisé |
| Analytics (sept routes) | 401 | 403 | Autorisé | Autorisé |
| Liste des utilisateurs | 401 | 403 | 403 | Autorisé |
| Modification outils, catégories, départements, utilisateurs | 401 | 403 | 403 | Autorisé |
| Notifications personnelles | 401 | Autorisé | Autorisé | Autorisé |

Les départements sont publics pour le formulaire d'inscription. Les managers ont accès aux analytics globaux : le filtre département est un filtre métier, pas une frontière d'autorisation dans le contrat actuel.

## Résultats

- 67 contrôles HTTPS réussis sur staging : connexion/déconnexion des trois comptes, lectures autorisées, sept routes analytics, refus de dix routes de mutation pour manager et employé, refus de cinq lectures anonymes.
- Les tentatives de mutation utilisaient des corps vides et des identifiants inexistants ; aucune donnée métier modifiée. Les mutations administrateur ont été couvertes localement avec services simulés, pas rejouées en staging.
- 144 tests locaux réussis dans six suites : rôles, utilisateurs, notifications, authentification et DTO inscription/profil.
- Couverture étendue : lectures catégories, trois routes notifications, sessions absentes/révoquées/expirées ou appartenant à un autre compte, propriétaire de notification issu de la session malgré un userId injecté dans la requête.
- Les tests existants couvrent le rôle courant en base plutôt que celui d'un ancien JWT, les comptes inactifs, le dernier administrateur actif et la propriété des notifications.
- Aucune faille confirmée dans ce périmètre ; aucune modification du code métier ni déploiement nécessaire. Les nouveaux tests restent locaux jusqu'à publication.

Limites : pas de nouveau parcours visuel navigateur, pas de changement réel de rôle ou de statut en staging, pas d'audit exhaustif de sécurité. Les refus HTTP sont vérifiés directement à l'API, indépendamment des boutons affichés par le frontend.
