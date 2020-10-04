/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const createConfig = require('./lib/cfg')
const { candle, light, pack, createWXS, createLicense } = require('./lib/ops.js')

module.exports = (name, extra = {}) => {
  const config = createConfig(name, ['default', 'pkg', 'rc'], extra)
  const lconf = config.wxs.license

  return pack(config.bin.entry, config.bin.exe)
    .then(_ => lconf.skip
      ? Promise.resolve(null)
      : createLicense(lconf.src, lconf.file)
    )
    .then(_ => createWXS(config.file.wix, config.wxs))
    .then(_ => candle(config.file.wix, config.file.obj))
    .then(_ => light(config.file.obj, config.file.msi))
}
