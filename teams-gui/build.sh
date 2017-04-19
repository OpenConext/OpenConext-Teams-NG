#!/bin/bash
rm -Rf dist/*
rm -Rf target/*
yarn lint && yarn test && yarn install && yarn run webpack
