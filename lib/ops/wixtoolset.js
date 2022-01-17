/*! Copyright (c) 2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const path = require('path').win32
const { promisify } = require('util')
const execFile = promisify(require('child_process').execFile)

const { WIX_FOLDER } = require('../../util/misc')

const candleExePath = path.join(WIX_FOLDER, 'candle')
const lightExePath = path.join(WIX_FOLDER, 'light')

const candle = (wxs, wxsobj) => execFile(candleExePath, [
  wxs,
  '-arch', 'x64',
  '-ext', 'WiXUtilExtension',
  '-out', wxsobj
])

const light = (wxsobj, msi) => execFile(lightExePath, [
  wxsobj,
  '-ext', 'WiXUtilExtension',
  '-ext', 'WiXUIExtension',
  '-out', msi
])

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  candle,
  light
}
