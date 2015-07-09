'use strict';

var glob = require('..')({ gitignore: true });


var files = glob.readdirSync('**/*');
console.log(files.length);
