FROM node

WORKDIR /service/resume

ENV NODE_ENV=prod

COPY package.json .

RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 8004

CMD ["sh", "-c", "node src/index.js"]