'use strict';

var glob = require('..')({ gitignore: true });

glob.on('dir', function (file) {
  console.log(file.path);
});

glob.readdirStream('**/*');
