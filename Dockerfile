FROM node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df AS build
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
ARG SITE_URL=https://aicommentmoderation.com
ARG SITE_RELEASE=false
ARG SITE_COMMIT
ENV SITE_URL=${SITE_URL} SITE_RELEASE=${SITE_RELEASE} SITE_COMMIT=${SITE_COMMIT}
COPY package.json package-lock.json ./
RUN npm install -g npm@11.9.0
RUN npm ci
COPY . .
RUN npm run check && npm run lint && npm run format:check && npm test && npm run test:fault && npm run build

FROM nginx:1.30.5-alpine@sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94 AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/deploy/generated/security-headers.conf /etc/nginx/security-headers.conf
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:8080/healthz | grep -qx ok || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
