# Graphiques Analytics par période

Implémentation locale du 4 octobre 2026 ; non déployée.

- L’API Analytics par période fournit une répartition des coûts enregistrés par outil et département, leur couverture mensuelle et le nombre d’utilisateurs distincts avec sessions positives par outil.
- Seuls les coûts et usages de la période sélectionnée alimentent les répartitions. Les outils sans coût ni usage sur la période sont exclus ; un coût absent reste null, distinct d’un coût enregistré nul.
- Répartition départementale et classement des cinq outils les plus coûteux utilisent les dépenses cumulées de la période, additionnées en centimes.
- Classements d’usage basés sur les utilisateurs distincts par outil, dédupliqués entre sessions et mois. Les outils sans session positive peuvent apparaître dans les moins utilisés ; le classement des plus utilisés exclut les compteurs nuls.
- Part départementale calculée avec les mêmes dépenses que le camembert ; pourcentages affichés comme tels, sans devise dans l’infobulle. Aucun pourcentage inventé lorsque les dépenses sont nulles.
- Chargement et échec des indicateurs : les graphiques de période ne présentent pas de valeurs issues du catalogue actuel en remplacement.
- Les insights de renouvellement et d’économies potentielles conservent les valeurs actuelles du catalogue, dans un objet séparé des indicateurs par période.
- Export CSV : répartitions et classements identiques aux graphiques ; coûts indisponibles laissés vides. Les lignes de catalogue et statuts actuels sont explicitement nommées.

## Limites

Départements et noms des outils restent ceux du catalogue actuel. Aucun historique de budget, statut ou département introduit dans cette étape. Les montants sont les coûts enregistrés, sans estimation pour les mois absents ; le mois courant peut être partiel. Les usages nuls signifient absence de session positive enregistrée, pas une preuve d’absence d’usage réel.

## Validation

22 tests analytics backend, 21 tests frontend, TypeScript backend/frontend et ESLint ciblé frontend réussis. Tests dédiés : franchissement de période, sommes en centimes, déduplication des utilisateurs, outils sans coût connu, absence de données, changements de classement et concordance CSV/graphiques. Pas encore de contrôle visuel ni de déploiement pour cette étape.
