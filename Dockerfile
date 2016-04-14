FROM node:4.4.2
RUN mkdir bitbloq-backend
COPY dist /bitbloq-backend
WORKDIR /bitbloq-backend
RUN npm cache clean && npm install
CMD node index.js
