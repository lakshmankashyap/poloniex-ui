FROM nodesource/node:6.2.2

RUN mkdir -p /home/nodejs/app/static
WORKDIR /home/nodejs/app

COPY ./node_modules /home/nodejs/app/node_modules
COPY ./server.js /home/nodejs/app
COPY ./static /home/nodejs/app/static

CMD ["node", "server.js"]