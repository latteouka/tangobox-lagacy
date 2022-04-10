FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build
RUN npx prisma generate

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
USER node
