/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

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
    describe: 'Image use as icon in application panel: an ico/png image'
  }
}, {
  key: 'b',
  details: {
    alias: 'banner',
    type: 'string',
    describe: 'Installer image used in banner: a jpg/png image'
  }
}, {
  key: 'B',
  details: {
    alias: 'background',
    type: 'string',
    describe: 'Installer left panel image: a jpg/png image'
  }
}, {
  key: 'c',
  details: {
    alias: 'color',
    type: 'string',
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
    describe: 'save options in .wixrc file'
  }
}]
