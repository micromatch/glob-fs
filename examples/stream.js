'use strict';

var glob = require('..')({ gitignore: true });

glob.readdirStream('**/*')
  .on('data', function (file) {
    console.log(file.path);
  });
