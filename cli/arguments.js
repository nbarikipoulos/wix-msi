/*! Copyright (c) 2020-22 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')
const path = require('path')

const { loadJSON } = require('../util/misc')
const isFromCLI = require('./yargs-utils')

// Get value of option to use from rc file and cli.
// Note value must be defined => option will be set
// to default value of the argument if not provided
const getOptionValues = (argv, file = RC_FILE) => {
  const result = {}

  const name = argv._[0] // target bin name

  // Options for this bin from rc file
  const rc = loadRCFile(file)?.[name] ?? {}

  // Remove option not used for the stuff
  const descs = ARGS.filter(arg => arg.details?.alias !== 'save')

  for (const desc of descs) {
    const key = desc.key
    const alias = desc.details.alias
    const rcValue = rc[alias]
    const cliValue = argv[alias] // User or default

    const fromCLI = isFromCLI(key, alias)

    const selectCLIValue = fromCLI || rcValue === undefined

    result[alias] = selectCLIValue ? cliValue : rcValue
  }

  return result
}

// ////////////////////////////////
// wixrc file utilities
// ////////////////////////////////

const RC_FILE = '.wixrc'

const loadRCFile = (file = RC_FILE) => loadJSON(RC_FILE) ?? {}

const saveOptions = (name, options, file = RC_FILE) => {
  // Do not save default
  const toSave = {}
  for (const [k, v] of Object.entries(options)) {
    // Get default in arguments
    const defaultValue = get(k)?.details?.default
    // No default defined or values are different
    if (defaultValue === undefined || v !== defaultValue) {
      toSave[k] = v
    }
  }

  return pfs.writeFile(
    path.resolve(process.cwd(), file),
    JSON.stringify({ [name]: toSave }, null, 2)
  )
}

// key or alias
const get = (name) => ARGS.find(arg => arg.key === name || arg.details?.alias === name)

const ARGS = [{
  key: 'l',
  details: {
    alias: 'license',
    type: 'boolean',
    default: true,
    describe: 'Include license'
  }
}, {
  key: 'e',
  details: {
    alias: 'exe',
    type: 'string',
    describe: 'Executable name (name defined in package will be use if not provided)'
  }
}, {
  key: 'd',
  details: {
    alias: 'dir',
    type: 'string',
    default: 'build',
    describe: 'Build folder'
  }
}, {
  key: 'H',
  details: {
    alias: 'homepage',
    type: 'string',
    describe: 'Add a shorcut to the project homepage if provided'
  }
}, {
  key: 'a',
  details: {
    alias: 'author',
    type: 'string',
    describe: 'Override the author field'
  }
}, {
  key: 'i',
  details: {
    alias: 'icon',
    type: 'string',
    default: '__package/assets/icon.png',
    describe: 'Image use as icon in application panel: an ico/png image'
  }
}, {
  key: 'b',
  details: {
    alias: 'banner',
    type: 'string',
    default: '__package/assets/banner.png',
    describe: 'Installer image used in top-right of banner: a jpg/png image'
  }
}, {
  key: 'B',
  details: {
    alias: 'background',
    type: 'string',
    default: '__package/assets/background.png',
    describe: 'Installer left panel image: a jpg/png image'
  }
}, {
  key: 'c',
  details: {
    alias: 'color',
    type: 'string',
    default: 'white',
    describe: 'Installer background color: a css compliant color'
  }
},
{
  key: 'U',
  details: {
    alias: 'uuid',
    type: 'string',
    describe: 'Uuid of the product'
  }
}, {
  key: 's',
  details: {
    alias: 'save',
    type: 'boolean',
    default: false,
    describe: `Save options in ${RC_FILE} file`
  }
}, {
  key: 'f',
  details: {
    alias: 'files',
    type: 'boolean',
    default: false,
    describe: 'Use \'files\' prop in package.json for file dependencies' +
      ' (in case of use of non-literal arg in require).'
  }
}]

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  ARGS,
  getOptionValues,
  saveOptions
}
