FROM node:6.8
VOLUME ["/server/app"]
WORKDIR /server

COPY package.json .
RUN npm install
RUN npm install nodemon -g

CMD npm start
EXPOSE 5678
