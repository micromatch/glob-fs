# glob-fs [![NPM version](https://badge.fury.io/js/glob-fs.svg)](http://badge.fury.io/js/glob-fs)

> node.js file globber.

## TODO

* [ ] Multiple pattern support
* [ ] Negation patterns (might not do this, since it can be handled in middleware)
* [x] middleware
* [x] middleware handler
* [ ] externalize middleware to modules ([prs welcome!](#contributing))
* [x] events
* [x] sync iterator
* [x] async iterator
* [x] stream iterator
* [ ] promise iterator
* [x] glob.readdir (async)
* [x] glob.readdirSync
* [x] glob.readdirStream
* [ ] glob.readdirPromise

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i glob-fs --save
```

## Usage

```js
var glob = require('glob-fs');
```

## API

### [.readdir](lib/readers.js#L27)

Asynchronously glob files or directories that match the given `pattern`.

**Params**

* `pattern` **{String}**: Glob pattern
* `options` **{Object}**
* `cb` **{Function}**: Callback

**Example**

```js
var glob = require('glob-fs')({ gitignore: true });

glob.readdir('*.js', function (err, files) {
  //=> do stuff with `files`
});
```

### [.readdirSync](lib/readers.js#L59)

Synchronously glob files or directories that match the given `pattern`.

**Params**

* `pattern` **{String}**: Glob pattern
* `options` **{Object}**
* `returns` **{Array}**: Returns an array of files.

**Example**

```js
var glob = require('glob-fs')({ gitignore: true });

var files = glob.readdirSync('*.js');
//=> do stuff with `files`
```

### [.readdirStream](lib/readers.js#L89)

Stream files or directories that match the given glob `pattern`.

**Params**

* `pattern` **{String}**: Glob pattern
* `options` **{Object}**
* `returns` **{Stream}**

**Example**

```js
var glob = require('glob-fs')({ gitignore: true });

glob.readdirStream('*.js')
  .on('data', function (file) {
    console.log(file.path);
  })
  .on('error', console.error)
  .on('end', function () {
    console.log('end');
  });
```

### [Glob](index.js#L32)

Optionally create an instance of `Glob` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var Glob = require('glob-fs').Glob;
var glob = new Glob();
```

### [.exclude](index.js#L155)

Thin wrapper around `.use()` for easily excluding files or directories that match the given `pattern`.

**Params**

* `pattern` **{String}**
* `options` **{Object}**

**Example**

```js
var gitignore = require('glob-fs-gitignore');
var dotfiles = require('glob-fs-dotfiles');
var glob = require('glob-fs')({ foo: true })
  .exclude(/\.foo$/)
  .exclude('*.bar')
  .exclude('*.baz');

var files = glob.readdirSync('**');
```

### [.use](index.js#L194)

Add a middleware to be called in the order defined.

**Params**

* `fn` **{Function}**
* `returns` **{Object}**: Returns the `Glob` instance, for chaining.

**Example**

```js
var gitignore = require('glob-fs-gitignore');
var dotfiles = require('glob-fs-dotfiles');
var glob = require('glob-fs')({ foo: true })
  .use(gitignore())
  .use(dotfiles());

var files = glob.readdirSync('*.js');
```

## Related projects

* [braces](https://github.com/jonschlinkert/braces): Fastest brace expansion for node.js, with the most complete support for the Bash 4.3 braces… [more](https://github.com/jonschlinkert/braces)
* [fill-range](https://github.com/jonschlinkert/fill-range): Fill in a range of numbers or letters, optionally passing an increment or multiplier to… [more](https://github.com/jonschlinkert/fill-range)
* [is-glob](https://github.com/jonschlinkert/is-glob): Returns `true` if the given string looks like a glob pattern.
* [micromatch](https://github.com/jonschlinkert/micromatch): Glob matching for javascript/node.js. A drop-in replacement and faster alternative to minimatch and multimatch. Just… [more](https://github.com/jonschlinkert/micromatch)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/glob-fs/issues/new).

### Middleware conventions

* **Naming**: any middleware published to npm should be prefixed with `glob-fs-`, as in: `glob-fs-dotfiles`.
* **Keywords**: please add `glob-fs` to the keywords array in package.json
* **Options**: all middleware should return a function that takes an `options` object, as in the below [Middleware Example](#middleware-example)
* **Return `file`**: all middleware should return the `file` object after processing.

### Middleware example

All middleware runs synchronously in the order in which it's defined by the user.

```js
// `notests` middleware to exclude any file in the `test` directory
function tests(options) {
  return function(file) {
    if (/^test\//.test(file.dirname)) {
      file.exclude = true;
    }
    return file;
  };
}

// usage
var glob = glob({ gitignore: true })
  .use(tests())

// get files
glob.readdirStream('**/*')
  .on('data', function (file) {
    console.log(file.path);
  })
```

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on July 07, 2015._