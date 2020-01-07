#!/bin/bash

rm -rf cov
mkdir -p cov
export NODE_V8_COVERAGE=cov
node lib/main.js
export NODE_V8_COVERAGE=
for file in $(ls cov); do
  echo ${file}
  mv cov/${file} cov/coverage.json
done
