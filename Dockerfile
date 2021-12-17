FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules && \
  chown -R node:node /home/node/app

WORKDIR /home/node
USER node

COPY yarn.lock app
COPY package.json app

WORKDIR /home/node/app

RUN yarn --pure-lockfile

COPY . /home/node/app

CMD [ "yarn", "start" ]