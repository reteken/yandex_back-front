#!/bin/bash

if ! command -v docker &> /dev/null; then
    echo "Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

mkdir -p data nginx
if [ ! -f nginx/nginx.conf ]; then
    cp nginx.conf nginx/nginx.conf
fi

docker-compose up -d --build
