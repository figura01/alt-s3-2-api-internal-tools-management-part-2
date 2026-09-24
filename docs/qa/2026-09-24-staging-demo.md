# Jeu de démonstration staging — 24 septembre 2026

Environnement : https://staging.techcorp.laurent-vuillaume.ovh

## Comptes

- ADMIN existant : `laurent@test.com`.
- MANAGER créé, ACTIVE : `manager@staging.techcorp.test`.
- EMPLOYEE créé, ACTIVE : `employee@staging.techcorp.test`.
- Les deux comptes de test appartiennent au département Demo Engineering et disposent de mots de passe aléatoires distincts.
- Identifiants complets dans le mémo local `.private/MEMO-ACCES-TECHCORP.md`, permissions 600, exclu de Git. Aucun mot de passe dans ce rapport.

## Données fictives conservées pour les essais

| Outil | Département | Coût mensuel | Utilisateurs cumulés | Statut |
| --- | --- | ---: | ---: | --- |
| Demo TeamChat | Demo Engineering | 120 € | 8 | ACTIVE |
| Demo CodeForge | Demo Engineering | 85 € | 5 | ACTIVE |
| Demo ArchiveBox | Demo Engineering | 49 € | 0 | UNUSED |
| Demo CampaignFlow | Demo Marketing | 60 € | 3 | EXPIRING |
| Demo OldMetrics | Demo Marketing | 25 € | 0 | INACTIVE |

Total catalogue : **339 € / mois**, 16 utilisateurs cumulés par outil. Ces comptes cumulés sont des données fictives et ne représentent pas 16 comptes créés. Trois catégories ont été ajoutées : Demo Collaboration, Demo Development et Demo Marketing. Les descriptions des outils précisent leur caractère fictif.

Aucun historique de dépenses ni journal de sessions métier n'a été inventé : le graphique historique peut rester vide, et le nombre d'utilisateurs uniques avec usage enregistré est nul. Demo ArchiveBox porte explicitement le statut UNUSED pour alimenter les économies potentielles.

## Vérifications

- Connexion HTTPS réussie pour les deux nouveaux comptes ; rôle du profil conforme.
- Catalogue : 200 pour MANAGER et EMPLOYEE.
- Analytics : 200 pour MANAGER, 403 pour EMPLOYEE.
- Liste des utilisateurs et création d'outils : 403 pour les deux rôles.
- Passage de Demo CampaignFlow à EXPIRING via l'API : notification reçue par le manager ; aucune notification de gestion reçue par l'employé.
- Déconnexion API des deux sessions de test réussie.
- Connexion MANAGER et consultation Analytics confirmées dans Chrome : total mensuel 339 €, cinq outils et une échéance.
- Export CSV réellement téléchargé dans `~/Downloads/analytics-all-3m-2026-09-24.csv`. Contenu lu et vérifié : cinq lignes Tools, somme 339, statut EXPIRING présent. Ce premier export précède le reclassement de Demo ArchiveBox d'ACTIVE vers UNUSED.
- Second export téléchargé dans `~/Downloads/analytics-all-3m-2026-09-24 (1).csv` : statut UNUSED et économies potentielles de 49 € vérifiés dans le fichier, avec toujours cinq outils et un total de 339 €. L'interface Analytics affiche également 49 € et un outil inutilisé.

La production et les comptes de développement n'ont pas été modifiés.
