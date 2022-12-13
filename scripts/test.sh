#!/usr/bin/env bash

set -e

if [[ "${CI}" ]]; then
  export $(xargs <"$(git rev-parse --show-toplevel)/.env")
  if [[ -z ${DATABASE_URL} ]]; then
    echo "DATABASE_URL is not set"
    exit 1
  else
    echo "Using CI database"
  fi
else
  export DATABASE_URL=mysql://root:bowlpickem@localhost:3364/bowlpickem-test
fi

yarn prisma migrate reset --force --skip-seed --skip-generate
yarn jest --config .jest.config.cjs "$@"
