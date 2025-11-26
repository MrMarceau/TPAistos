# TPAistos

## Démarrage
- Prérequis : Docker + Docker Compose. Node 20 / pnpm uniquement si vous voulez lancer API ou web hors Docker.
- Copier `.env.example` (racine) vers `.env` et renseigner : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Ce fichier est injecté dans les services via docker-compose. Les `.env.example` dans `api/` et `web/` servent uniquement aux lancements hors Docker.
- Lancer la stack : `docker compose up --build`.
- Créer le schéma : `docker compose run --rm api pnpm db:migrate` (DB `tpaistos`, user/pass `tpaistos`).
- Importer le CSV : `docker compose run --rm api pnpm db:seed` (fichier `debiteurs.csv` monté dans le conteneur).
- Activer le webhook Stripe en dev : `stripe listen --forward-to http://localhost:3001/webhooks/stripe` et copier le `whsec_...` dans `.env`.
- Parcours front : http://localhost:3000/debts (table cliquable) puis page détail avec paiement via Stripe Elements. Statut passe à PAID après réception du webhook (polling automatique côté front).
- Points d’entrée utiles : front http://localhost:3000, API http://localhost:3001/health, Adminer http://localhost:8080 (serveur `db`, user/pass/db `tpaistos`).

## Choix d’architecture
- Monorepo (pnpm workspace) et docker-compose pour démarrer en quelques commandes avec une API, un front et une DB et comportement identiques sur tous les OS.
- TypeORM + Postgres : choix SQL et ORM de préférence (Prisma était possible, préférence subjective pour TypeORM) ; migrations TS et seed CSV.
- Next.js (React) pour le front : stack demandée dans l'exercice et largement adoptée, je crois beaucoup en son potentiel dans l'industrie.
- NestJS pour l’API : TypeScript comme demandé, influence Express/Angular et .NET dans mes premières années d'études, structure très familière pour moi. Ça rajoute un peu de boilerplate pour un petit projet, mais en échange on gagne une architecture claire et facilement extensible. 
- Postgres pour le relationnel ; Mongo aurait été rapide pour prototyper mais Postgres permet de rester en SQL, ce qui colle bien à un futur contexte de recouvrement bancaire (transactions, contraintes, relations...).
- Modèle de données : pour l’instant il n’y a qu’une entité Debt issue du CSV mais dans un vrai produit il y aurait plus de tables et de relations et la structure TypeORM/Nest est pensée pour accepter facilement ces extensions.
- Stripe : l’intégration se limite à des paiements uniques avec un webhook qui marque la dette comme payée. Je n’implémente pas les cas plus avancés (paiements partiels, litiges, devises, etc.)
- Docker Compose oriente dev : dépendances dans l’image, code bind-mount pour hot reload (`pnpm start:dev` API, `pnpm dev` front), Adminer pour l’administration.
- API : REST avec 4 endpoints : 
  - GET /debts
  - GET /debts/:id
  - POST /debts/:id/pay
  - POST /webhooks/stripe

## Avant une mise en production
- Authentification : aujourd’hui l’API est volontairement ouverte. En production il faudrait au minimum en sécuriser l’accès.
- Validation des entrées : formaliser des DTO Input et Output pour toutes les routes, avec validation stricte (class-validator, éventuellement zod côté front mais je préfère class-validator qui s'intègre bien dans l'écosystème NestJS) afin de contrôler à 100% ce qui rentre et ce qui sort de l'API.
- Journalisation : ajouter des logs structurés, des métriques avec un minimum d’alerting. Pour un contexte financier, garder une trace de jorunalisation est, je pense, obligatoire.
- Sécurité : restreindre les origines CORS, ajouter du rate limiting sur les endpoints, configurer correctement les headers de sécurité, HTTPS partout.
- Protection des données : les données manipulées (nom, email, sujet de dette, éventuellement montants) sont considérées comme sensibles. En production, il faudrait chiffrer certains champs en base, minimiser les données stockées (et leur durée de rétention!) et prévoir des mécanismes de suppression/anonymisation.
- Scalabilité : ici une simple liste suffit mais pour un volume plus important il faudrait ajouter pagination, filtres côté API, éventuellement du cache (HTTP, CDN), optimiser les index en base de données.
- Qualité et CI/CD : mettre en place des tests unitaires qui sont les plus importants à mes yeux, des tests end-to-end. On peut imaginer un pipeline CI/CD qui exécute lint, tests et build, et une étape qui applique les migrations avant déploiement.

## Ressources utilisées
- Documentation officielle de Next.js, de Postgres & de Stripe principalement.
- Assistants IA 
  - ChatGPT Codex CLI + Claude Code. J'utilise principalement ChatGPT pour poser des questions ainsi que pour scaffolder du code côté back-end et j'utilise Claude Code pour m'aider sur des tâches orientées front-end
- Outils
  - Node.js 20 et pnpm pour la gestion des dépendances.
  - Docker / Docker Compose pour exécuter l’ensemble des services localement.
  - Stripe CLI (`stripe listen`) pour tester les webhooks en environnement local.

