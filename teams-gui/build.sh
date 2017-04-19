#!/bin/bash
rm -Rf dist/*
rm -Rf target/*
yarn lint
echo "Lint executed with status $?"
if [ $? -eq 0 ]
then
  exit 1
fi
yarn install
yarn run webpack
