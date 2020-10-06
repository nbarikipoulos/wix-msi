/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { validate: uuidValidate } = require('uuid')

module.exports = [{
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
  key: 'i',
  details: {
    alias: 'ico',
    type: 'string',
    describe: 'Icon in application panel (.ico file)'
  }
}, {
  key: 'b',
  details: {
    alias: 'banner',
    type: 'string',
    describe: 'MSI banner: (493x58) jpg'
  }
}, {
  key: 'B',
  details: {
    alias: 'background',
    type: 'string',
    describe: 'MSI background: (493x312) jpg'
  }
}, {
  key: 'U',
  details: {
    alias: 'uuid',
    type: 'string',
    describe: 'Uuid of the product',
    coerce: (value) => {
      const uuid = uuidValidate(value)
      if (!uuid) {
        throw new Error('Wrong uuid format!')
      }
      return value
    }
  }
}, {
  key: 's',
  details: {
    alias: 'save',
    type: 'boolean',
    describe: 'save options in .wixrc file'
  }
}]
