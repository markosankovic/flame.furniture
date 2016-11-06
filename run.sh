#!/bin/sh

git pull
docker stop flame.furniture && docker rm flame.furniture
docker build -t markosankovic/flame.furniture .
docker run -d -p 80:3000 --name=flame.furniture markosankovic/flame.furniture