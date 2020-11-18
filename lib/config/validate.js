/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path').win32

const { validate: uuidValidate } = require('uuid')
const { isWebUri } = require('valid-url')

const { factory: validator, createValidator } = require('../../util/update-validate')

module.exports = (config) => {
  const unv = validator(INPUT_DESCRIPTORS)

  unv.perform(config)
  return unv
}

const INPUT_DESCRIPTORS = [
  {
    name: 'name',
    validator: (value) => createValidator(
      PACKAGE.bin[value],
      `No bin named '${value}' found in package.json/bin`
    )
  },
  {
    name: 'exe',
    default: (name) => name,
    validator: (value) => createValidator(
      /^[\w-_]+$/.test(value),
      'Invalid name for executable. Use [A-Za-z0-9_-] characters'
    )
  }, {
    name: 'entry',
    default: (name) => PACKAGE.bin[name],
    validator: (value) => createValidator(
      value,
      'Check name option aka target bin in package.json'
    )
  }, {
    name: 'skipLicense',
    default: _ => DEFAULT.skipLicense
  }, {
    name: 'licenseSourceFile',
    default: (skipLicense) => {
      let result
      if (!skipLicense) {
        result = ['LICENSE', 'LICENSE.md']
          .map(fname => path.join(process.cwd(), fname))
          .find(p => fs.existsSync(p))
      }
      return result
    },
    validator: (value, skipLicense) => {
      return skipLicense
        ? createValidator(true, 'Not revelant', 'info')
        : createValidator(
          value !== undefined,
          'Unable to find LICENSE or LICENCE.md file. License page will be skipped',
          'info'
        )
    }
  }, {
    name: 'buildDir',
    default: _ => DEFAULT.buildDir
  }, {
    name: 'icon',
    default: (name) => DEFAULT.icon,
    validator: [
      (value) => createValidator(
        value.endsWith('.ico') || value.endsWith('.png'),
        'Only .ico or .png file are supported for icon'
      ),
      (value) => isFileExists(value)
    ]
  }, {
    name: 'version',
    default: (name) => PACKAGE.version,
    validator: (value) => createValidator(
      /^\d+(\.\d+){0,2}$/.test(value),
      `Version for MSI installer must follow the X.Y.Z format with X,Y,Z as number. Input: ${value}`
    )
  }, {
    name: 'author',
    default: (name) => PACKAGE.author,
    validator: (value) => createValidator(
      value,
      'No author name found. \'undefined\' will be used.',
      'warning'
    )
  }, {
    name: 'homepage',
    default: (name) => PACKAGE.homepage,
    validator: (value) => createValidator(
      value === undefined || isWebUri(value) !== undefined,
      'URL for link in msi does not seems valid',
      'warning'
    )
  }, {
    name: 'banner',
    default: (name) => DEFAULT.banner,
    validator: [
      (value) => createValidator(
        value.endsWith('.jpg') || value.endsWith('.jpeg'),
        'Banner must be a jpeg image.'
      ),
      (value) => isFileExists(value)
    ]
  }, {
    name: 'background',
    default: (name) => DEFAULT.background,
    validator: [
      (value) => createValidator(
        value.endsWith('.jpg') || value.endsWith('.jpeg'),
        'Background must be a jpeg image.'
      ),
      (value) => isFileExists(value)
    ]
  }, {
    name: 'uuid',
    validator: (value) => createValidator(
      uuidValidate(value),
      'Wrong uuid format!: Should be "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" where x is an hexadecimal'
    )
  }
]

const getPackage = _ => {
  const packageFile = path.resolve(process.cwd(), 'package.json')
  const { bin, version, author, homepage } = JSON.parse(fs.readFileSync(packageFile, 'utf8'))
  return { bin, version, author, homepage }
}

const PACKAGE = getPackage()

const DEFAULT = {
  skipLicense: false,
  buildDir: 'build',
  icon: 'assets/prompt.png',
  banner: 'assets/banner.jpg',
  background: 'assets/background.jpg'
}

const isFileExists = (value) => createValidator(
  fs.existsSync(path.join(process.cwd(), value)),
  `File ${value} does not exist`
)
