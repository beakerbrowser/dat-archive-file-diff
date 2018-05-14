const diff = require('diff')
const {InvalidEncodingError, SourceTooLargeError} = require('beaker-error-constants')
const {isFileNameBinary} = require('./util')

const MAX_DIFF_SIZE = 1048576 // 1mb in bytes

exports.diffLines = async function diffFile (leftArchive, leftPath, rightArchive, rightPath, opts) {
  // make sure we can handle the buffers involved
  await assertUsable(leftArchive, leftPath)
  await assertUsable(rightArchive, rightPath)

  // read the file in both sources
  const [leftFile, rightFile] = await Promise.all([
    leftArchive.readFile(leftPath, 'utf8').catch(err => ''),
    rightArchive.readFile(rightPath, 'utf8').catch(err => '')
  ])

  // return the diff
  return diff.diffLines(leftFile, rightFile, opts)
}

async function assertUsable (archive, filepath) {
  var isBinary = isFileNameBinary(filepath)
  if (isBinary === true) {
    throw new InvalidEncodingError(`Cannot diff a binary file: ${filepath}`)
  }
  let st = await archive.stat(filepath).catch(e => false)
  if (st && st.isFile() && st.size > MAX_DIFF_SIZE) {
    throw new SourceTooLargeError()
  }
}
