FROM node:4.4.2
RUN apt-get update && apt-get install -y git
RUN mkdir /usr/bitbloq-backend
COPY bitbloq-backend /usr/bitbloq-backend
WORKDIR /usr/bitbloq-backend
RUN npm cache clean && npm install
CMD node index.js
