################################################################################
# Create a stage for building the application.

ARG APP_NAME=chartsite-frontend

# Build client app
FROM node:22.0-bookworm-slim AS build_client

ARG CLIENT_APP_PATH=./frontend/client_react

WORKDIR /app/client

COPY ${CLIENT_APP_PATH}/src /app/client/src 
COPY ${CLIENT_APP_PATH}/package.json /app/client/package.json
COPY ${CLIENT_APP_PATH}/package-lock.json /app/client/package-lock.json
COPY ${CLIENT_APP_PATH}/tsconfig.json /app/client/tsconfig.json
COPY ${CLIENT_APP_PATH}/tsconfig.node.json /app/client/tsconfig.node.json
COPY ${CLIENT_APP_PATH}/vite.config.ts /app/client/vite.config.ts
COPY ${CLIENT_APP_PATH}/public /app/client/public
COPY ${CLIENT_APP_PATH}/index.html /app/client/index.html

RUN npm install
RUN npm run build

# Build admin app
FROM node:22.0-bookworm-slim AS build_admin

ARG ADMIN_APP_PATH=./frontend/admin

WORKDIR /app/admin

COPY ${ADMIN_APP_PATH}/src /app/admin/src 
COPY ${ADMIN_APP_PATH}/package.json /app/admin/package.json
COPY ${ADMIN_APP_PATH}/package-lock.json /app/admin/package-lock.json
COPY ${ADMIN_APP_PATH}/tsconfig.json /app/admin/tsconfig.json
COPY ${ADMIN_APP_PATH}/tsconfig.node.json /app/admin/tsconfig.node.json
COPY ${ADMIN_APP_PATH}/vite.config.ts /app/admin/vite.config.ts
COPY ${ADMIN_APP_PATH}/public /app/admin/public
COPY ${ADMIN_APP_PATH}/index.html /app/admin/index.html

RUN npm install
RUN npm run build

################################################################################
# Create a stage for running the application.

FROM nginx:1.27.1-bookworm AS final

# Copy the build from client app
COPY --from=build_client /app/client/dist /usr/share/nginx/html

# Copy the build from client app
COPY --from=build_admin /app/admin/dist /usr/share/nginx/html/admin

EXPOSE 80

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]


