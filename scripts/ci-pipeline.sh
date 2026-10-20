#!/bin/bash
echo 'Running lint...'
npm test
echo 'Building container...'
docker build -t enterprise-backend:ci .
