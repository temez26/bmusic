FROM node:22

EXPOSE 4200

WORKDIR /app

RUN npm install -g nodemon

ENV PATH /app/node_modules/.bin:$PATH

COPY *.json ./

RUN npm install

COPY . .

CMD ["nodemon", "--watch", ".", "--ext","ts,html,scss", "--exec", "npm", "start", "--legacy-watch"]