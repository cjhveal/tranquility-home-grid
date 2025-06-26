# BUILD
FROM node:24-alpine AS build

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build


# SERVE
FROM nginx:mainline-alpine AS webserver

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build /home/node/app/dist /var/www/html

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
