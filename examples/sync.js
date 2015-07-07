'use strict';

var glob = require('..')({ gitignore: true });


var files = glob.readdirSync('**/*.js');
console.log(files.length);
