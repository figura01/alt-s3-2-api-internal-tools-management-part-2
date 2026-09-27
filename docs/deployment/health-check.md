# Surveillance TechCorp

Depuis la racine du dépôt sur le Mac :

```sh
ssh -o BatchMode=yes ubuntu@51.91.99.187 'python3 -' < deploy/check-techcorp.py
```

Le script est exécuté en mémoire sur le VPS, sans installation ni modification de services. Il utilise uniquement la bibliothèque standard Python et Docker CLI.

Contrôles : disque inférieur à 85 % (espace réservé pris en compte), sept conteneurs attendus (Caddy et services TechCorp des deux environnements), santé PostgreSQL, sauvegarde quotidienne de chaque environnement âgée de 36 heures maximum et contrôle des cinq SHA-256, pages de connexion HTTPS avec certificat valide et HTTP 200 sans redirection.

Code de sortie 0 si tous les contrôles réussissent, 1 sinon. Chaque contrôle continue même si un autre échoue. Les erreurs indiquent le contrôle concerné et leur type, sans afficher les secrets, données sauvegardées ou sorties Docker brutes.

Ce contrôle ne remplace pas une restauration complète, un test authentifié des parcours métier ni une surveillance extérieure au VPS. Les services portfolio et test-projet-1 sont hors de son périmètre.

## Exécution autonome sur le VPS

Le timer `techcorp-health.timer` lance le service toutes les heures, avec un décalage aléatoire de zéro à deux minutes. Il est persistant : une échéance manquée est rattrapée au démarrage. Le Mac peut être éteint.

Le script est installé dans `/home/ubuntu/.local/bin/techcorp-health.py` (700), les unités dans `/etc/systemd/system/` (644). Le service utilise le compte ubuntu, un système de fichiers en lecture seule et une limite de cinq minutes. Aucun redémarrage ni nettoyage automatique n'est réalisé. L'accès Docker hérite des droits du compte ubuntu ; la lecture seule du système de fichiers ne restreint pas l'API Docker elle-même.

```sh
systemctl list-timers techcorp-health.timer --no-pager
systemctl show techcorp-health.service -p Result -p ExecMainStatus
journalctl -u techcorp-health.service -n 30 --no-pager
sudo systemctl start techcorp-health.service
```

Un service oneshot devient normalement inactif après un succès. Un échec produit un résultat `exit-code` et des lignes `FAIL` dans le journal. Aucune alerte externe n'est envoyée ; les anomalies se consultent sur le VPS. Pour suspendre le contrôle : `sudo systemctl disable --now techcorp-health.timer`.

Après mise à jour des fichiers installés, vérifier les unités avec `sudo systemd-analyze verify /etc/systemd/system/techcorp-health.service /etc/systemd/system/techcorp-health.timer`, puis `sudo systemctl daemon-reload`, lancer le service et activer le timer avec `sudo systemctl enable --now techcorp-health.timer`.

Tests locaux : `python3 -m unittest discover -s deploy -p 'test_check_techcorp.py'`.

## Suivi quotidien depuis le Mac

Depuis le 27 septembre 2026, la tâche Codex existante de 10 h combine copie des sauvegardes, diagnostic distant et vérification de l'état et de la fraîcheur du service horaire. Elle suit les nouvelles anomalies et les résolutions dans `.private/techcorp-monitor-state.json`, qui reste hors de Git. Le Mac et Codex doivent être disponibles. Ce suivi quotidien est distinct du contrôle horaire autonome du VPS.

La CI exécute les tests Python des sauvegardes et du diagnostic sans connexion au VPS ni accès aux secrets.
