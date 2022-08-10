FROM node:16.15-alpine3.14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN npm run build
RUN rm -rf src docs data images keycloak nginx

CMD ["npm", "start"]
