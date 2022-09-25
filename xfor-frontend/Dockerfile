# pull base image
FROM node:16.15.0-alpine

# set a work directory
WORKDIR /xfor/frontend

# install dependencies
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install

# copy app
COPY . .