'use strict';

var glob = require('..')({ gitignore: true })
  .use(dotfiles())

glob.on('include', function (file) {
  console.log('including:', file.path);
});

glob.on('exclude', function (file) {
  console.log('excluding:', file.path);
});

glob.readdirPromise('**/*');
