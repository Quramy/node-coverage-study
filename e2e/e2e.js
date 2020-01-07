const path = require('path');
const { fork } = require('child_process');

fork(path.resolve(__dirname, '../lib/main'), {
  cwd: path.join(__dirname, '../'),
});

fork(path.resolve(__dirname, '../lib/other'), {
  cwd: path.join(__dirname, '../'),
});
