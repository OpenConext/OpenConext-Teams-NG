#!/bin/bash
rm -Rf dist/*
rm -Rf target/*
yarn lint
yarn install
yarn run webpack
