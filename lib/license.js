/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const Mustache = require('mustache')

module.exports = async (src, tgt) => {
  const template = await fs.promises.readFile(
    path.resolve(__dirname, '../assets/license.mustache')
  ).then(b => b.toString('utf8'))

  const rl = readline.createInterface({
    input: fs.createReadStream(src),
    console: false
  })
  const lines = []

  for await (const line of rl) {
    lines.push(line)
  }

  const res = Mustache.render(template, { text: lines })

  await fs.promises.writeFile(tgt, res)

  return tgt
}
