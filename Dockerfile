FROM node:latest

WORKDIR /app

RUN apt-get update \
    && apt-get install -y vim \
    && apt-get install -y mc

COPY . .

EXPOSE 5173 7777 9999

CMD ["node"]