FROM node:alpine
EXPOSE 3000
WORKDIR /app

COPY . $WORKDIR
RUN npm install

CMD npm run dev
