FROM node:22

EXPOSE 4000

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY *.json ./

RUN npm install

COPY . .

CMD ["npx", "nodemon", "--watch", ".", "--ext", "js", "--exec", "npm", "start", "--legacy-watch"]