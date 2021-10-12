/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const createConfig = require('./lib/config')
const ops = require('./lib/ops')
const { doExecPromise: p } = require('./util/misc')

module.exports = (name, input = {}) => {
  // Validate input and "organize" them
  const config = createConfig(name, input)

  if (config === undefined) {
    return Promise.reject(new Error('Aborted: found error(s) in input'))
  }

  const bin = config.bin
  const files = config.file
  const wxs = config.wxs
  const icon = wxs.icon
  const license = wxs.license
  const banner = wxs.banner

  // Main job
  return ops.createDir(config.dir)
    .then(_ => Promise.all([
      ops.pack(bin.entry, bin.exe),
      p(!icon.src.endsWith('.ico'), _ => ops.createIcon(icon.src, icon.file)),
      p(!license.skip, _ => ops.createLicense(license.src, license.file)),
      ops.createBackground(wxs.background.src, wxs.background.file, wxs.color),
      ops.createBanner(banner.src, banner.file, wxs.color),
      ops.createWXS(files.wix, config.wxs)
    ]))
    .then(_ => ops.candle(files.wix, files.obj))
    .then(_ => ops.light(files.obj, files.msi))
    .catch(err => { console.log(err) })
}
