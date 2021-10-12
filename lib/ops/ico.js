/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')
const pngToIco = require('png-to-ico')
const Jimp = require('jimp')

module.exports = (src, tgt) => Jimp.read(src)
  .then(res => res.resize(256, 256))
  .then(res => res.quality(100))
  .then(res => res.getBufferAsync(Jimp.AUTO))
  .then(buffer => pngToIco(buffer))
  .then(buffer => pfs.writeFile(tgt, buffer))
