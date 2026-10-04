# Dépenses départementales et N−1

Implémentation locale, non déployée. Le camembert actuel est conservé. Un graphique horizontal compare la période sélectionnée (bleu) aux mêmes mois calendaires un an auparavant (gris), sur 1, 3 ou 12 mois. Le filtre département s’applique aux deux séries.

Montants agrégés en centimes ; départements présents dans l’une ou l’autre période inclus. Absence de données représentée par null, distinct de zéro. L’infobulle présente les deux montants, la couverture mensuelle et les écarts en euros et pourcentage. Les écarts exigent une couverture de tous les mois ; le pourcentage reste indisponible si N−1 vaut zéro. CSV enrichi avec les mêmes valeurs.

Le mois courant est partiel, les mois de N−1 complets : il ne s’agit pas d’un arrêt au même jour. Les départements reflètent la propriété actuelle des outils. Les KPI et leur comparaison avec la période précédente restent identiques.

Validation : 23 tests Analytics backend, 5 tests de graphiques/export frontend, TypeScript backend/frontend et ESLint ciblé réussis. Contrôle visuel et déploiement restent à effectuer.
