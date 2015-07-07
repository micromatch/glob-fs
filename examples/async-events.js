'use strict';

var glob = require('..')({ gitignore: true });

glob.on('dir', function (file) {
  console.log(file);
});

glob.readdir('**/*.js', function (err, files) {
  if (err) return console.error(err);
  console.log(files.length);
});
