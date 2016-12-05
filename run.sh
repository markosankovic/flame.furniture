#!/bin/sh

git pull &&
docker-compose build &&
docker-compose stop &&
docker-compose up