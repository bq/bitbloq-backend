FROM node:6.9.2
COPY dist /usr/bitbloq-backend
ENV MONGO_URL files_mongo_1
WORKDIR /usr/bitbloq-backend
CMD /bin/bash -c "npm start"
