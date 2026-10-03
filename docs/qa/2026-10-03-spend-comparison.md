# Comparaison du graphique des dépenses

Implémentation locale du 3 octobre 2026, non déployée.

- L’API spend-history renvoie désormais les 24 derniers mois au lieu de 12.
- Trait bleu plein : période sélectionnée. Trait gris pointillé : période précédente de même durée, intitulée Previous month, Previous 3 months ou Previous year.
- Comparaison annuelle : chaque mois est aligné avec son équivalent de l’année précédente. Sur trois mois : comparaison avec les trois mois qui précèdent ; sur un mois : mois précédent.
- Axe : noms courts des mois selon la locale. Sous-titre : plages exactes avec années. Infobulle : mois/année, montants des deux séries, différence en devise et pourcentage.
- Le mois courant est signalé comme partiel ; la période précédente est complète. Il ne s’agit pas d’une comparaison à date équivalente.
- Données absentes conservées en null, lignes interrompues, aucune interpolation. Pourcentage indisponible lorsque le montant précédent est nul ou absent.
- Filtre département appliqué aux deux séries ; rattachement historique toujours fondé sur le propriétaire départemental actuel.
- CSV enrichi avec les mois et dépenses précédents, le nombre de relevés et les écarts.

Validation : 12 tests backend ciblés, 9 tests frontend de calcul/CSV et vérification TypeScript frontend réussis. Aucun contrôle visuel navigateur effectué pour ce complément.
