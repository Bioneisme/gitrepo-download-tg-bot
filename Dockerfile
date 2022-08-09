FROM node:16.14.0 AS Production

WORKDIR usr/src

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start"]