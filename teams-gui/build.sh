#!/bin/bash
echo "zipping and uploading"
rm -Rf dist/*
rm -Rf target/*
yarn install && CI=true yarn test && yarn build
