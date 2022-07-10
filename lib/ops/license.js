'use strict'

const { createReadStream, promises: pfs } = require('fs')
const readline = require('readline')
const Mustache = require('mustache')

const { innerPath } = require('../../util/misc')

module.exports = async (src, tgt) => {
  const template = await pfs.readFile(
    innerPath('assets/license.mustache')
  ).then(b => b.toString('utf8'))

  const rl = readline.createInterface({
    input: createReadStream(src),
    console: false
  })
  const lines = []

  for await (const line of rl) {
    lines.push(line)
  }

  const res = Mustache.render(template, { text: lines })

  await pfs.writeFile(tgt, res)

  return tgt
}
