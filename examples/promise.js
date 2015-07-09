'use strict';

var glob = require('..')({ gitignore: true });

glob.readdirPromise('**/*')
  .then(function (files) {
    console.log(files);
    console.log(files.length);
  });
