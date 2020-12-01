/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const createConfig = require('./lib/config/cfg')
const { createDir, createIcon, createBackground, createBanner, candle, light, pack, createWXS, createLicense } = require('./lib/ops.js')

module.exports = (name, options = {}) => {
  const config = createConfig(name, options)

  if (config === undefined) {
    return Promise.reject(new Error('Aborted: found error(s) in input'))
  }

  const fconf = config.file

  const lconf = config.wxs.license
  const icon = config.wxs.icon
  const color = config.wxs.color
  const banner = config.wxs.banner
  const background = config.wxs.background

  const p = (conditition, pProvider) => conditition ? pProvider() : Promise.resolve(null)

  return createDir(config.buildDir)
    .then(_ => Promise.all([
      pack(config.bin.entry, config.bin.exe),
      p(!icon.src.endsWith('.ico'), _ => createIcon(icon.src, icon.file)),
      p(!lconf.skip, _ => createLicense(lconf.src, lconf.file)),
      createBackground(background.src, background.file, color),
      createBanner(banner.src, banner.file, color),
      createWXS(fconf.wix, config.wxs)
    ]))
    .then(_ => candle(fconf.wix, fconf.obj))
    .then(_ => light(fconf.obj, fconf.msi))
    .catch(err => { console.log(err) })
}
