'use strict'

const { promises: pfs } = require('fs')
const pngToIco = require('png-to-ico')
const sharp = require('sharp')

module.exports = (src, tgt) => sharp(src)
  .resize(256, 256)
  .toFile(tmpFile(tgt))
  .then(_ => pngToIco(tmpFile(tgt)))
  .then(buffer => pfs.writeFile(tgt, buffer))

const tmpFile = (f) => `${f}.tmp.png`
