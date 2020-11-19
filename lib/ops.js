/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promisify } = require('util')
const execFile = promisify(require('child_process').execFile)
const { promises: pfs } = require('fs')
const { exec: execPack } = require('pkg')
const createWXS = require('./wxs')
const createLicense = require('./license')
const ico = require('./ico')

const createDir = (path) => pfs.mkdir(path, { recursive: true })

const pack = (entry, exe) => execPack([entry, '--targets', 'win-x64', '--output', exe])

const candle = (wxs, wxsobj) => execFile('candle', [
  wxs,
  '-arch', 'x64',
  '-ext', 'WiXUtilExtension',
  '-out', wxsobj
])

const light = (wxsobj, msi) => execFile('light', [
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
  createDir, pack, ico, candle, light, createWXS, createLicense
}
