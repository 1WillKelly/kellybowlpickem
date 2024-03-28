#!/usr/bin/env bash

if [[ "${VERCEL_ENV}" == "production" ]] ; then
  echo "Running production migrations"
  echo "DATABASE_URL: ${DATABASE_URL}"
  echo "MIGRATIONS_DATABASE_URL: ${MIGRATIONS_DATABASE_URL}"
  DATABASE_URL="${MIGRATIONS_DATABASE_URL}" npx prisma migrate deploy
else
  echo "Not migrating in non-prod vercel environment: ${VERCEL_ENV}"
fi
