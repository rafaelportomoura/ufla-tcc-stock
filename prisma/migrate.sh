#!/bin/bash

echo "CREATE_DATABSE: $CREATE_DATABASE"

if [ "$CREATE_DATABASE" = "true" ]; then
  pnpx prisma migrate dev
fi

node dist/handlers/server.js