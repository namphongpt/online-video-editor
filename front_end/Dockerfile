FROM node:21 AS build

ARG ENVIRONMENT=production

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$ENVIRONMENT" = "production" ]; then \
        mv .env.prod .env; \
        rm .env.dev; \
        rm .env.staging; \
    elif [ "$ENVIRONMENT" = "staging" ]; then \
        mv .env.staging .env; \
        rm .env.dev; \
        rm .env.prod; \
    else \
        cp .env.dev .env; \
        rm .env.prod; \
        rm .env.staging; \
    fi

RUN npm run build

FROM nginx:alpine AS publish

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
