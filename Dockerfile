FROM node:alpine

WORKDIR /app/client

COPY ./client/package.json ./

RUN npm install

COPY ./client ./

ARG VITE_API_ENDPOINT=/api

ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}

RUN VITE_API_ENDPOINT=${VITE_API_ENDPOINT} npm run build

WORKDIR /app/server

COPY ./server/package.json ./

RUN npm install

COPY ./server ./

RUN rm -rf ./dist

RUN mv ../client/dist ./

ENV PORT=8000

EXPOSE 8000

CMD [ "npm", "start" ]