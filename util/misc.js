/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

const path = require('path')
const acorn = require('acorn')

const getFuncArgs = (func) => acorn.parse(func, { ecmaVersion: 'latest' })
  .body[0]
  .expression
  .params
  .map(n => n.name)
  .filter(v => v !== '_')

const MODULE_ROOT_PATH = path.join(__dirname, '..')
const innerPath = (...innerPaths) => path.join(MODULE_ROOT_PATH, ...innerPaths)

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  getFuncArgs,
  innerPath,
  WIX_FOLDER: innerPath('wix_bin')
}
