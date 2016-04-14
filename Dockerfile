FROM node:4.4.2
RUN apt-get update && apt-get install -y git
RUN mkdir bitbloq-backend
COPY bitbloq-backend /bitbloq-backend
WORKDIR /bitbloq-backend
RUN npm cache clean && npm install
CMD node index.js
