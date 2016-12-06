#!/bin/sh

git pull &&
docker-compose build &&
docker-compose stop &&
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d