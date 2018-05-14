const diff = require('diff')
const {InvalidEncodingError, SourceTooLargeError} = require('beaker-error-constants')
const {isFileNameBinary, isFileContentBinary} = require('./util')

exports.diffLines = async function diffFile (leftArchive, leftPath, rightArchive, rightPath, opts) {
  // check the filename to see if it's binary
  assertPathNotBinary(leftPath)
  assertPathNotBinary(rightPath)

  // make sure we can handle the buffers involved
  assertUsable(leftArchive, leftPath)
  assertUsable(rightArchive, rightPath)

  // read the file in both sources
  const [leftFile, rightFile] = await Promise.all([
    leftArchive.readFile(filepath, 'utf8'),
    rightArchive.readFile(filepath, 'utf8')
  ])

  // return the diff
  return diff.diffLines(leftFile, rightFile, opts)
}

function assertPathNotBinary (filepath) {
  var isBinary = isFileNameBinary(filepath)
  if (isBinary === true) {
    throw new InvalidEncodingError(`Cannot diff a binary file: ${filepath}`)
  }
}

function assertUsable (archive, filepath) {
  let st
  st = await archive.stat(filepath)
  if (isBinary !== false && st && st.isFile() && await isFileContentBinary(archive, filepath)) {
    throw new InvalidEncodingError('Cannot diff a binary file')
  }
  if (st && st.isFile() && st.size > MAX_DIFF_SIZE) {
    throw new SourceTooLargeError()
  }
}