#!/bin/bash
echo "zipping and uploading"
rm -Rf build/*
rm -Rf target/*
yarn install && CI=true yarn test && yarn build
