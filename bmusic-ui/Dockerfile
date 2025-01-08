FROM node:22

EXPOSE 4200

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY *.json ./

RUN npm install

COPY . .

CMD ["nodemon", "--watch", ".", "--ext","ts,html,scss", "--exec", "npm", "start", "--legacy-watch"]