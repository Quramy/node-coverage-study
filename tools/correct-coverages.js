#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const glob = require('glob');
const minimatch = require('minimatch');
const { mergeProcessCovs, mergeScriptCovs } = require('@c88/v8-coverage');

function isFileToCorrect(urlString, minimatchCondition) {
 if (urlString.startsWith('file://')) {
   const url = new URL(urlString);
   const relativeSrcPath = path.relative(process.cwd(), url.pathname);
   if (minimatch(relativeSrcPath, minimatchCondition)) {
     return true;
   }
   return false;
 } else {
   return false;
 }
}

function convert(file, minimatchCondition) {
  const json = require(file);
  const correctedResults = [];
  const correctedSourceMapCache = {};
  json.result.forEach(r => {
    if (isFileToCorrect(r.url, minimatchCondition)) {
      correctedResults.push(r);
    }
  });
  if (json['source-map-cache']) {
    Object.entries(json['source-map-cache']).forEach(([k, v]) => {
      if (isFileToCorrect(k, minimatchCondition)) {
        correctedSourceMapCache[k] = v;
      }
    });
  }
  if (correctedResults.length) {
    return {
      result: correctedResults,
      ['source-map-cache']: correctedSourceMapCache,
    };
  } else {
    return null;
  }
}

function main(v8CoverageDirectory, minimatchCondition = '**/*') {
  const files = glob.sync('**/*.json', {
    cwd: v8CoverageDirectory,
  });
  const correctedProcessCovs = files.map(f => convert(path.resolve(v8CoverageDirectory, f), minimatchCondition)).filter(f => !!f)
  const mergedResult = mergeProcessCovs(correctedProcessCovs).result;
  const mergedSourceMapCache = correctedProcessCovs.reduce((acc, processCov) => Object.assign({}, acc, processCov['source-map-cache']), { });
  const mergedCoverage = { result: mergedResult, ['source-map-cache']: mergedSourceMapCache };
  console.log(JSON.stringify(mergedCoverage, null, 2));
}

const v8CoverageDirectory = path.resolve(process.cwd(), process.argv.slice(2)[0]);
const minimatchCondition = process.argv.slice(2)[1];

main(v8CoverageDirectory, minimatchCondition);
