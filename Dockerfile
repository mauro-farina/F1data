FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY app/package*.json ./
RUN npm install
COPY ./app /usr/src/app
EXPOSE 8080
CMD ["node", "app.js"]