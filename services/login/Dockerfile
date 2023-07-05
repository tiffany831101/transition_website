FROM node

WORKDIR /service/login

ENV NODE_ENV=prod

COPY package.json .

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 8003

CMD ["sh", "-c", "node src/index.js"]