FROM node:21 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine AS publish

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
