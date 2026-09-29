FROM node:22-slim AS app
ENV NEXT_TELEMETRY_DISABLED=1 CI=1
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Construction : base d'exemple + contenu de démarrage cuits dans l'image (copiés sur le volume au 1er démarrage).
ARG NEXT_PUBLIC_SITE_URL
ARG SITE_NOINDEX
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL SITE_NOINDEX=$SITE_NOINDEX \
    PAYLOAD_SECRET=build-only-secret DATABASE_URL=file:./payload.db SEED_SKIP_ADMIN=1
RUN pnpm seed && pnpm build \
 && mkdir -p seed-data && cp payload.db seed-data/ && cp -r media seed-data/media

ENV NODE_ENV=production DATABASE_URL=file:/data/payload.db
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
