# Sauvegardes autonomes TechCorp

Installées sur le VPS le 24 septembre 2026. Elles fonctionnent sans le Mac et sans tâche Codex.

## Fréquence et contenu

- Chaque jour à **03:15 Europe/Paris** (heure d'été/hiver prise en charge).
- Timer systemd `techcorp-backup.timer`, activé au démarrage. `Persistent=true` permet de rattraper une échéance manquée quand le VPS redémarre.
- Service `techcorp-backup.service`, exécuté par `ubuntu`.
- Script installé : `/home/ubuntu/.local/bin/techcorp-backup.py`. Source dans `deploy/backup-techcorp.py`.
- Production puis staging ; un échec sur un environnement n'empêche pas la tentative sur l'autre. Le service échoue si l'un des deux échoue.
- Destination : `/home/ubuntu/backups/techcorp/daily/<environnement>/<date-UTC>/`.
- Contenu : `database.dump` PostgreSQL, `environment.env`, `compose.yml`, `Caddyfile`, métadonnées du commit et sommes SHA-256.
- Fichiers en 600, dossiers en 700. Ils contiennent des secrets et des données privées.
- Conservation des **sept dernières journées réussies par environnement**. Les sauvegardes initiales placées hors de `daily/` ne sont jamais supprimées par ce script.

La sauvegarde est écrite dans un dossier temporaire puis publiée après succès de pg_dump, lecture de l'archive par pg_restore et contrôle SHA-256. Un verrou empêche les exécutions simultanées. Une seconde exécution le même jour vérifie les fichiers existants sans les remplacer. Une archive corrompue provoque un échec explicite. La rétention ne s'applique qu'après création d'une nouvelle sauvegarde réussie.

Le script refuse de commencer si le disque a moins de 512 Mio libres. Cela ne garantit pas que l'espace restant suffira pour une base qui grandit ; surveiller la capacité avant les prochains déploiements.

## Contrôler ou lancer

Sur le VPS :

```sh
systemctl list-timers techcorp-backup.timer --no-pager
systemctl status techcorp-backup.service --no-pager
journalctl -u techcorp-backup.service -n 30 --no-pager
sudo systemctl start techcorp-backup.service
```

Le service est normalement « inactive (dead) » après un lancement réussi, car il est de type oneshot. Le timer doit être actif. Consulter le résultat du service et son journal pour distinguer succès et échec.

## Réinstaller après modification

Transférer les trois fichiers de `deploy/` vers le VPS puis installer le script avec les permissions 700 à son emplacement indiqué, et les unités avec les permissions 644 dans `/etc/systemd/system/`. Ensuite :

```sh
sudo systemd-analyze verify /etc/systemd/system/techcorp-backup.service /etc/systemd/system/techcorp-backup.timer
sudo systemctl daemon-reload
sudo systemctl start techcorp-backup.service
sudo systemctl enable --now techcorp-backup.timer
```

Ne pas afficher le contenu des fichiers `environment.env` dans les journaux.

## Restaurer pour vérifier

Utiliser une base **nouvelle et séparée** ; ne jamais restaurer directement dans la base métier pour un simple contrôle. Exemple pour la production, à adapter avec une date existante :

```sh
cd /srv/apps/techcorp
docker compose --env-file .env.production -f compose.production.yml exec -T postgres createdb -U techcorp techcorp_restore_check
docker compose --env-file .env.production -f compose.production.yml exec -T postgres pg_restore -U techcorp -d techcorp_restore_check --exit-on-error < /home/ubuntu/backups/techcorp/daily/production/2026-09-24/database.dump
docker compose --env-file .env.production -f compose.production.yml exec -T postgres psql -U techcorp -d techcorp_restore_check -c 'SELECT count(*) FROM users;'
# Après vérification, supprimer seulement la base de contrôle créée ci-dessus :
docker compose --env-file .env.production -f compose.production.yml exec -T postgres dropdb -U techcorp techcorp_restore_check
```

## Vérification initiale du 24 septembre 2026

- Quatre tests du script réussis : publication et relance le même jour, échec sans archive partielle publiée, détection de corruption et rétention limitée aux dossiers quotidiens.
- Premier lancement réel réussi pour production et staging ; second lancement sans doublon, avec contrôle SHA-256 réussi.
- Les deux archives quotidiennes du 24 septembre ont été restaurées intégralement dans des bases temporaires séparées : un compte et 11 migrations dans chacune. Ces bases de vérification ont été supprimées ensuite.
- Timer activé et actif ; prochaine échéance observée : 25 septembre 2026 à 01:15 UTC, soit 03:15 à Paris.

## Limites opérationnelles

- Une copie quotidienne sur le Mac est maintenant programmée (voir ci-dessous). Si le Mac ou Codex est arrêté, les nouvelles sauvegardes restent uniquement sur le VPS jusqu'à une récupération réussie.
- Les échecs sont enregistrés dans systemd/journald ; aucune alerte externe par e-mail ou autre service n'est configurée.
- Le contrôle quotidien de l'archive et des sommes ne remplace pas une restauration complète périodique.
- Les sources locales de cette installation doivent être conservées avec le dépôt ; l'installation sur le VPS ne réalise pas de commit Git.

## Copies sur le Mac

- Destination : `/Users/laurentvuillaume/Backups/TechCorp`, hors du dépôt Git.
- Automatisation Codex « Copie des sauvegardes TechCorp sur le Mac », active chaque jour à **10 h**, heure locale du Mac (Europe/Paris lors de sa création).
- Identifiant : `copie-des-sauvegardes-techcorp-sur-le-mac` ; cette tâche reprend la conversation existante.
- Le Mac doit être allumé, connecté à Internet et Codex ouvert. Le dépôt doit rester à son emplacement actuel. Aucun abonnement de stockage distant n'a été ajouté ; l'automatisation utilise Codex.
- Commande exécutée depuis la racine du projet : `python3 deploy/pull-backups-mac.py`.
- Transfert SSH avec la clé existante et vérification stricte de l'hôte. Aucun mot de passe n'est inclus dans le script ou la tâche programmée.
- Chaque exécution récupère toutes les journées encore disponibles sur le VPS, contrôle les cinq sommes SHA-256, puis publie les copies terminées. Les transferts incomplets ne remplacent pas les sauvegardes existantes.
- Conservation des **30 dernières journées copiées** pour chaque environnement ; les fichiers supprimés sur le VPS ne sont pas automatiquement supprimés du Mac.
- Dossiers locaux en 700, fichiers en 600. Les copies contiennent des secrets : ne pas les publier.
- En cas d'absence de plus de sept journées, certaines sauvegardes intermédiaires peuvent avoir été supprimées du VPS avant la reprise des copies.
- Notification prévue uniquement en cas d'anomalie, d'autorisation nécessaire ou de reprise après un échec signalé.

Première récupération réelle du 24 septembre réussie : staging et production copiés, sommes SHA-256 et permissions vérifiées. Trois tests du script passent : copie et relance sans doublon avec détection de corruption, nettoyage d'un transfert échoué, rétention limitée aux copies vérifiées.

Les vérifications d'intégrité ne remplacent pas une restauration. Les archives sources du 24 septembre avaient été restaurées avec succès sur le VPS avant cette copie.
