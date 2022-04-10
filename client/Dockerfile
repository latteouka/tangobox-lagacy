FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .
COPY next.config-server.js next.config.js

RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]
