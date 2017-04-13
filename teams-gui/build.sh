#!/bin/bash
rm -Rf dist/*
rm -Rf target/*
yarn install
yarn run webpack
