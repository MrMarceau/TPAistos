# TPAistos

## Démarrage
- Prérequis : Docker + Docker Compose, Node 20 / pnpm si vous voulez lancer hors Docker.
- Copier les exemples d’environnement si besoin (`api/.env.example`, `web/.env.example`) vers vos propres fichiers et ajuster les clés Stripe plus tard.
- Lancer la stack : `docker compose up --build`.
- Exécuter les migrations TypeORM : `docker compose run --rm api pnpm db:migrate` (base `tpaistos`, user/pass `tpaistos`).
- Importer le CSV (`debiteurs.csv` monté dans le conteneur) : `docker compose run --rm api pnpm db:seed`.
- Liste/détail des dettes côté front : http://localhost:3000/debts (cliquez une ligne pour le détail).
  - Paiement Stripe test : renseigner un fichier `.env` à la racine (chargé par docker-compose) avec `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ou exportez-les dans votre shell.
- Points d’entrée : front http://localhost:3000, API http://localhost:3001/health, Adminer http://localhost:8080 (serveur db = `db`, user/pass/db = `tpaistos`).
- Si vous modifiez `package.json` ou les configs compilateur, reconstruisez l’image concernée : `docker compose build api` ou `docker compose build web`.

## Choix d’architecture
- Monorepo simple (pnpm workspace) avec `api/` (NestJS) et `web/` (Next.js App Router).
- Persistance : TypeORM + Postgres (table `Debt`), avec migrations TS et seed CSV via `pnpm db:seed`.
- Base de données Postgres via Docker, Adminer pour l’administration.
- Docker Compose oriente dev : dépendances installées en image, code bind-mount pour hot reload (`pnpm start:dev` côté API, `pnpm dev` côté front).
- Node 20, TypeScript strict, ESLint minimal côté API; Next lint côté front.
- Stripe test : endpoint `POST /debts/:id/pay` pour créer un PaymentIntent, webhook `POST /webhooks/stripe` pour marquer la dette comme payée sur `payment_intent.succeeded`.

## Avant une mise en production
- Générer et committer les lockfiles (`pnpm install`), builder des images optimisées prod (Next `next build` + `next start`, Nest build TS -> JS).
- Consolider le cycle migrations (CI/CD `pnpm db:migrate` ou `typeorm migration:run` avec build JS) et ajouter des validations runtime d’environnement.
- Brancher l’observabilité (logs structurés, healthcheck complet, metrics) et gérer les secrets via un vault ou variables sécurisées.
- Durcir le réseau (pas d’expositions 3000/3001/8080 publiques), activer HTTPS côté reverse-proxy.

## Ressources utilisées
- Documentation NestJS, Next.js, Postgres, Adminer.
- Outils : Docker/Docker Compose, pnpm, TypeScript, ESLint.
