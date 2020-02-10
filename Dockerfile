FROM node:12-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

EXPOSE 25 5939

CMD ["npm", "start"]
