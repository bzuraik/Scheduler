#!/bin/bash

uwsgi --socket 0.0.0.0:5000 --protocol=http /usr/src/schedule-planner/backend/wsgi.ini &

nginx -g "daemon off;"