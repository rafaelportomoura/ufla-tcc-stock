#!/bin/sh

echo "MIGRATE_DATABASE: $MIGRATE_DATABASE"

if [ "$MIGRATE_DATABASE" = "true" ]; then
  pnpx prisma migrate dev
fi

node dist/handlers/server.js