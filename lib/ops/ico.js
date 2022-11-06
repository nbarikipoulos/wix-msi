'use strict'

const { promises: pfs } = require('fs')
const pngToIco = require('png-to-ico')
const sharp = require('sharp')

module.exports = (src, tgt) => sharp(src)
  .resize(256, 256)
  .toBuffer()
  .then(buffer => pngToIco(buffer))
  .then(buffer => pfs.writeFile(tgt, buffer))
