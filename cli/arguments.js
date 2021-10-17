/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { readFileSync, promises: pfs } = require('fs')
const path = require('path')

const RC_FILE = '.wixrc'

const get = (alias) => ARGS.find(arg => arg.details.alias === alias)

const getOptions = (argv, file = RC_FILE) => {
  // Options from rc file
  const rc = loadRCFile(file)
  const name = argv._[0]

  // From cli
  // Remove cli args not used for configuration
  const cli = {}
  for (const arg of ARGS.filter(arg => arg.details.alias !== 'save')) {
    const alias = arg.details.alias
    if (undefined !== argv[alias]) {
      cli[alias] = argv[alias]
    }
  }

  return { ...rc[name], ...cli }
}

const loadRCFile = (file) => {
  let option = {}
  try {
    const buffer = readFileSync(
      path.resolve(process.cwd(), file),
      'utf8'
    )
    option = JSON.parse(buffer)
  } catch (error) { /* Do nothing */ }
  return option
}

const saveOptions = (name, options, file = RC_FILE) => {
  // Do not save default
  const toSave = {}
  for (const [k, v] of Object.entries(options)) {
    // Get default in arguments
    const defaultValue = get(k)?.details?.default
    // No default defined or values are different
    if (undefined === defaultValue || v !== defaultValue) {
      toSave[k] = v
    }
  }

  return pfs.writeFile(
    path.resolve(process.cwd(), file),
    JSON.stringify({ [name]: toSave }, null, 2)
  )
}

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
    alias: 'ico',
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
}]

module.exports = {
  ARGS,
  get,
  getOptions,
  saveOptions
}
