#!/usr/bin/env node

/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')
const { v4: generateUuid } = require('uuid')

const args = require('../cli/arguments')
const createMSI = require('../index')

const RC_FILE = '.wixrc'

// ////////////////////////////////
// ////////////////////////////////
// Build CLI
// ////////////////////////////////
// ////////////////////////////////

yargs
  .locale('en')
  .version()
  .alias('h', 'help')
  .usage('Usage: $0 [bin] --help for detailed help')
  .showHelpOnFail(false)
  .strict()
  .demandCommand(1)

args.forEach(arg => yargs.option(arg.key, arg.details))

const argv = yargs.argv

const _argv = _ => {
  const result = {
    buildDir: argv.buildDir,
    exe: argv.exe,
    homepage: argv.homepage,
    ico: argv.ico,
    banner: argv.banner,
    background: argv.background,
    uuid: argv.uuid
  }
  for (const p in result) {
    if (!result[p]) {
      delete result[p]
    }
  }
  return result
}

const loadRCFile = (file) => {
  let option = {}
  try {
    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), file),
      'utf8'
    )
    option = JSON.parse(buffer)
  } catch (error) { /* Do nothing */ }
  return option
}

// ////////////////////////////////
// ////////////////////////////////
// Main job
// ////////////////////////////////
// ////////////////////////////////

const rc = loadRCFile(RC_FILE)
const name = argv._[0]
const options = { ...rc[name], ..._argv() }

let shouldSave = argv.save

if (!('uuid' in options)) {
  options.uuid = generateUuid()
  shouldSave = true
}

createMSI(name, options).then(_ => shouldSave
  ? fs.promises.writeFile(
      path.resolve(process.cwd(), RC_FILE),
      JSON.stringify({ [name]: options }, null, 2)
    )
  : Promise.resolve(null)
).catch(err => { console.log(err.message) })
