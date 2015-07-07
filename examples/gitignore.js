'use strict';

var glob = require('..')({ gitignore: true });

glob.readdir('**/*.js', function (err, files) {
  if (err) return console.error(err);
  console.log(files.length);
});
