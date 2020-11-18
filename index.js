/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const createConfig = require('./lib/config/cfg')
const { ico, candle, light, pack, createWXS, createLicense } = require('./lib/ops.js')

module.exports = (name, options = {}) => {
  const config = createConfig(name, options)

  if (config === undefined) {
    return Promise.reject(new Error('Aborted: found error(s) in input'))
  }

  const lconf = config.wxs.license
  const icon = config.wxs.icon

  const p = (conditition, pProvider) => conditition ? pProvider() : Promise.resolve(null)

  return Promise.all([
    p(!icon.src.endsWith('.ico'), _ => ico(icon.src, icon.tgt)),
    p(!lconf.skip, _ => createLicense(lconf.src, lconf.file)),
    pack(config.bin.entry, config.bin.exe),
    createWXS(config.file.wix, config.wxs)
  ])
    .then(_ => candle(config.file.wix, config.file.obj))
    .then(_ => light(config.file.obj, config.file.msi))
    .catch(err => { console.log(err) })
}
