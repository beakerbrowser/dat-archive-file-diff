const path = require('path')
const textextensions = require('textextensions')
const binextensions = require('binary-extensions')

exports.isFileNameBinary = function (filepath) {
  var ext = path.extname(filepath)
  if (ext.startsWith('.')) ext = ext.slice(1)
  if (binextensions.includes(ext)) return true
  if (textextensions.includes(ext)) return false
  return undefined // dont know
}

