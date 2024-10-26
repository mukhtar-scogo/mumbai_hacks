FROM node:16.18.0
WORKDIR /app

ARG SQL_HOST
ARG SQL_USER
ARG SQL_PASSWORD
ARG SQL_DB

ENV SQL_HOST ${SQL_HOST}
ENV SQL_USER ${SQL_USER}
ENV SQL_PASSWORD ${SQL_PASSWORD}
ENV SQL_DB ${SQL_DB}

COPY /whatsapp-integration .
COPY ../package*.json .
RUN npm install
CMD ["node", "sendWhatsappNotification.js"]