#!/bin/sh

git pull
docker build -t markosankovic/flame.furniture .
docker stop flame.furniture && docker rm flame.furniture
docker run -d -p 80:3000 --name=flame.furniture markosankovic/flame.furniture