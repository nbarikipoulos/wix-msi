#!/usr/bin/env node

'use strict'

const yargs = require('yargs')
const { v4: generateUuid } = require('uuid')

const createMSI = require('../index')
const { ARGS, getOptionValues, saveOptions } = require('../cli/arguments')
const { doExecPromise: p } = require('../util/misc')

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

ARGS.forEach(arg => yargs.option(arg.key, arg.details))

// ////////////////////////////////
// ////////////////////////////////
// Get options
// ////////////////////////////////
// ////////////////////////////////

// Bin name is positional (and mandatory)
const name = yargs.argv._[0]

// Get option values for rc file and cli
const options = getOptionValues(yargs.argv)

let save = yargs.argv.save

// check if uuid is provided
if (options.uuid === undefined) {
  options.uuid = generateUuid()
  save = true // then enforce saving options
}

// ////////////////////////////////
// ////////////////////////////////
// Main job
// ////////////////////////////////
// ////////////////////////////////

createMSI(name, options)
  .then(_ => p(save, _ => saveOptions(name, options)))
  .catch(err => { console.log(err.message) })
