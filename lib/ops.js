/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')
const path = require('path').win32
const { exec: execPack } = require('pkg')
const { promisify } = require('util')
const execFile = promisify(require('child_process').execFile)
const createWXS = require('./wxs')
const createLicense = require('./license')
const createIcon = require('./ico')
const { createBackground, createBanner } = require('./images')

const { WIX_FOLDER } = require('../util/misc')

const candleExePath = path.join(WIX_FOLDER, 'candle')
const lightExePath = path.join(WIX_FOLDER, 'light')

const createDir = (path) => pfs.mkdir(path, { recursive: true })

const pack = (entry, exe) => execPack([entry, '--targets', 'win-x64', '--output', exe])

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
  createDir,
  pack,
  createIcon,
  createBanner,
  createBackground,
  candle,
  light,
  createWXS,
  createLicense
}
