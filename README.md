# KellyBowlPickem.com

## Analytics

View site analytics on [Umami here](https://umami.ndella.com/share/8Sg1V1oqrbThkYIw)

## Development environment

This repository uses Docker (and `docker-compose`) in development for its MySQL
database.

```sh
docker-compose up -d
```

### First time setup

Copy `.env.example` to `.env`:

```sh
cp .env.example .env
```

Then, fill in `CFBD_API_KEY` with a valid [CollegeFootballData.com API
key](https://collegefootballdata.com/key).

Fill in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` with Google OAuth 2.0
credentials (for the admin interfac).

### Migrations

If your database is out of sync, or if you made some schema changes and want to
deploy a migration, run:

```sh
yarn prisma migrate dev
```

## Syncing data

In local development, you can run the webhooks without authentication:

```sh
curl localhost:3000/api/sync/sync-bowl-games
```

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
