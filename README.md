# KellyBowlPickem.com

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

### Migrations

If your database is out of sync, or if you made some schema changes and want to
deploy a migration, run:

```sh
yarn prisma migrate dev
```

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
