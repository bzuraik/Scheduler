FROM ubuntu:latest

# Dependencies
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York
RUN apt-get --assume-yes update
RUN apt-get --assume-yes install \
    python3-flask \
    uwsgi \
    uwsgi-plugin-python3 \
    nginx \
    curl \
    npm

# Specifying Node version
RUN npm install -g n
RUN n install lts

COPY deployment/ssl/certs/nginx-selfsigned.crt /etc/ssl/certs
COPY deployment/ssl/private/nginx-selfsigned.key /etc/ssl/private
COPY deployment/ssl/dhparam/dhparam.pem /etc/nginx

COPY deployment/nginx/nginx.conf /etc/nginx/sites-available/default
COPY deployment/nginx/self-signed.conf /etc/nginx/snippets
COPY deployment/nginx/ssl-params.conf /etc/nginx/snippets

WORKDIR ./frontend/

COPY ./frontend/package.json .
RUN npm install

COPY ./frontend/src/ src/
COPY ./frontend/public/ public/
RUN npm run build
RUN cp -r build/. /usr/share/nginx/html

COPY backend/ /usr/src/schedule-planner/backend/
ENV FLASK_APP=/usr/src/schedule-planner/backend/
EXPOSE 443

WORKDIR ..

COPY deployment/startup.sh .
CMD ["/bin/bash", "./startup.sh"]
