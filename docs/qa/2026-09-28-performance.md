# Première mesure des performances

Mesures HTTPS staging depuis le Mac, cinq requêtes séquentielles par route après connexion, sans affichage du contenu. Temps curl total : réseau/TLS et serveur compris, pas un profil SQL ni un temps de rendu navigateur. Jeu de données de cinq outils, non représentatif d'un catalogue volumineux.

| Route | Médiane (ms) | Maximum (ms) | Corps reçu (octets, dernier échantillon) |
| --- | ---: | ---: | ---: |
| /tools?page=1&limit=10 | 96,0 | 160,3 | 2174 |
| /tools?page=1&limit=100 | 68,8 | 84,5 | 2175 |
| /analytics | 65,8 | 83,4 | 387 |
| /analytics/spend-history | 65,0 | 67,7 | 182 |
| /departments | 62,0 | 70,3 | 601 |

## Analyse du code et changement local

Analytics lance quatre chargements en parallèle : KPI, départements, catalogue complet et historique. Le catalogue complet nécessite une requête pour cent outils puis une requête par page supplémentaire ; les pages restantes sont lancées simultanément. Cette architecture mérite une mesure avec un jeu volumineux avant une refonte. Aucun problème de charge n'est démontré par les cinq outils du staging.

Le cache React Query est déjà configuré avec une fraîcheur de cinq minutes, sans rechargement au focus pour les données métier. Le KPI global n'est pas redemandé par le composant de filtre : son appel supplémentaire est activé uniquement pour un département précis. Ces observations sont issues du code, pas d'une capture réseau navigateur.

Le catalogue sans filtre effectuait deux comptages identiques : total et total filtré. Le changement local conserve un seul comptage et réutilise le résultat, passant de trois à deux opérations Prisma de catalogue (lecture et comptages, hors authentification). Les recherches filtrées conservent leurs deux comptages, y compris lorsqu'elles ne retournent aucun résultat. Aucun cache supplémentaire ni changement de contrat API.

Validation : 16 tests ciblés réussis (service et mapper), dont huit cas ajoutés pour le comptage sans filtre, la recherche vide, les différents filtres et les bornes de coût à zéro. Aucun gain de latence après déploiement revendiqué : modification non déployée. Session staging déconnectée après mesure ; aucune donnée métier modifiée.
