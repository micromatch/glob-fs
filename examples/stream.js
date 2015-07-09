'use strict';

var glob = require('..')({ gitignore: true });
var i = 0;

glob.readdirStream('**/*')
  .on('data', function (file) {
    i++;
    console.log(file.path);
  })
  .on('end', function () {
    console.log(i);
  });
