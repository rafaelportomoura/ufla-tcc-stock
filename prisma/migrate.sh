#!/bin/sh

echo "MIGRATE_DATABASE: $MIGRATE_DATABASE"

if [ "$MIGRATE_DATABASE" = "true" ]; then
  pnpx prisma migrate dev
fi

echo "Finish migrate"

ls -la .

node dist/handlers/server.js