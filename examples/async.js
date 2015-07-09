'use strict';

var glob = require('..')({ gitignore: true });


glob.readdir('**/*', function (err, files) {
  if (err) return console.error(err);
  console.log(files.length);
});
