#!/bin/sh
set -e
# Premier démarrage : le volume /data reçoit la base et les médias préparés à la construction.
if [ ! -f /data/payload.db ]; then
  echo "Initialisation du volume /data"
  cp /app/seed-data/payload.db /data/payload.db
  mkdir -p /data/media && cp -r /app/seed-data/media/. /data/media/
fi
mkdir -p /data/media
rm -rf /app/media && ln -sfn /data/media /app/media
pnpm exec tsx scripts/create-admin.ts
exec pnpm exec next start -H 0.0.0.0 -p "${PORT:-3000}"
