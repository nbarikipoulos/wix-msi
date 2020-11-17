/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

const acorn = require('acorn')

const getFuncArgs = (func) => acorn.parse(func, { ecmaVersion: 'latest' })
  .body[0]
  .expression
  .params
  .map(n => n.name)
  .filter(v => v !== '_')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  getFuncArgs
}
