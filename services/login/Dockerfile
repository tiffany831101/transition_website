FROM node

WORKDIR /service/login

COPY package.json .

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 8003

CMD ["sh", "-c", "NODE_ENV=prod && node src/index.js"]