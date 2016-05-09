FROM node:4.4.2
COPY dist /usr/bitbloq-backend
ENV MONGO_URL files_mongo_1
WORKDIR /usr/bitbloq-backend
CMD /bin/bash -c "sed -i 's@MONGO_URL@'"$MONGO_URL"'@g' /usr/bitbloq-backend/app/res/config/config.js && node index.js"
