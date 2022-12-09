#!/usr/bin/env bash

if [[ "${VERCEL_ENV}" == "production" ]] ; then
  echo "Running production migrations"
  npx prisma migrate deploy
else
  echo "Not migrating in non-prod vercel environment: ${VERCEL_ENV}"
fi
