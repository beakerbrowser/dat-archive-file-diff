# dat-archive-file-diff

Get line-by-line diffs of text files in Dat archives. Basically a thin wrapper around [jsdiff](https://github.com/kpdecker/jsdiff).

```js
const {diffLines} = require('dat-archive-file-diff')

var a = new DatArchive('...')
var b = new DatArchive('...')
var diff = await diffLines(a, '/foo.txt', b, '/foo.txt')
```

## API

### diffLines (leftArchive, leftPath, rightArchive, rightPath, options)

 - Options:
   - `ignoreWhitespace`: true to ignore leading and trailing whitespace.
   - `newlineIsToken`: true to treat newline characters as separate tokens. This allows for changes to the newline structure to occur independently of the line content and to be treated as such. In general this is the more human friendly form of diffLines and diffLines is better suited for patches and other computer friendly output.
 - Returns a list of change objects (See below).

### Change objects

Many of the methods above return change objects. These objects consist of the following fields:

 - `value`: Text content
 - `added`: True if the value was inserted into the new string
 - `removed`: True of the value was removed from the old string

Note that some cases may omit a particular flag field. Comparison on the flag fields should always be done in a truthy or falsy manner.
