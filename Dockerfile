FROM node:slim as BUILDER
LABEL maintainer="Avantpro"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install


# Bundle app source
COPY . .
RUN yarn build

FROM node:slim as RUNNER

# Instale as dependências necessárias
RUN apt-get update && apt-get install -y wget gnupg2 lsb-release

# Adicione o repositório oficial do PostgreSQL e instale o cliente PostgreSQL 16
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && apt-get update && apt-get install -y postgresql-client-16

WORKDIR /usr/src/app
COPY --chown=node:node --from=BUILDER /usr/src/app ./
CMD [ "node", "dist/index.js" ]