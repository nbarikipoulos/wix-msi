/*! Copyright (c) 2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

// Check is option was provided by user on cli
module.exports = (key, alias) => {
  const _alias = alias ?? key
  const regexp = `(^-\\w*[${key}]\\w*)` + // -k or -XkYZ
  `|(^--(${key}|${_alias})$)` + // --k (seems ok) or --alias
  `|(^--no-(${key}|${_alias})$)` // --no-k --no-alias

  const re = new RegExp(regexp)

  const result = process.argv
    .slice(2)
    .find(arg => re.test(arg))

  return result !== undefined
}
