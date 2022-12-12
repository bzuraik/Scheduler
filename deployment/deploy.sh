#!/bin/bash

gcloud auth login

gcloud config set project schedule-planner-366417 --quiet

gcloud config set run/region us-east1

gcloud auth configure-docker us-east1-docker.pkg.dev

docker build -t us-east1-docker.pkg.dev/schedule-planner-366417/schedule-planner/schedule-planner ..

docker push us-east1-docker.pkg.dev/schedule-planner-366417/schedule-planner/schedule-planner

gcloud compute instances stop vm-schedule-planner

gcloud compute instances start vm-schedule-planner
