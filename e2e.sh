#!/bin/bash

rm -rf cov
mkdir -p cov
export NODE_V8_COVERAGE=cov
node e2e/e2e.js > /dev/null
export NODE_V8_COVERAGE=
node tools/correct-coverages.js cov "lib/**/*.js" > coverage.json
