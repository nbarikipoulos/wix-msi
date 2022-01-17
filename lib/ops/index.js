/*! Copyright (c) 2020, 2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')

const pack = require('./pack')
const createLicense = require('./license')
const createIcon = require('./ico')
const { createBackground, createBanner } = require('./image')
const createWXS = require('./wxs')
const { candle, light } = require('./wixtoolset')

const createDir = (path) => pfs.mkdir(path, { recursive: true })

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createDir,
  pack,
  createLicense,
  createIcon,
  createBanner,
  createBackground,
  createWXS,
  candle,
  light
}
