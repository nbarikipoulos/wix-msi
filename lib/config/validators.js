'use strict'

const fs = require('fs')

const { validate: uuidValidate } = require('uuid')
const { isWebUri } = require('valid-url')

const { createTest, createValidator } = require('../../util/validate')

module.exports = _ => [
  createValidator('uuid') // uuid
    .add(createTest(
      (value) => uuidValidate(value),
      'Wrong uuid. Format must follow xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx with hexadecimal.'
    )),
  createValidator('version') // Version
    .add(createTest(
      (value) => /^\d+(\.\d+){0,2}$/.test(value),
      'Version for MSI installer must follow the X.Y.Z format with X,Y,Z as number'
    )),
  createValidator('exe') // Exe name
    .add(createTest(
      (value) => /^[\w-_]+$/.test(value),
      'Invalid name for executable. Use [A-Za-z0-9_-] characters'
    )),
  createValidator('entry') // Entry point
    .add(createTest(
      (value) => value !== undefined,
      'Check name option aka target bin in package.json'
    )),
  createValidator('author') // Author
    .add(undefinedValue('Author name is undefined'))
    .add(trimmedValueNotEmpty('Author name is empty/blank')),
  createValidator('homepage') // HomePage link in app menu
    .add(trimmedValueNotEmpty())
    .add(createTest(
      (value) => isWebUri(value),
      'URL for link in msi does not seem valid'
    ))
    .add(undefinedValue(
      'No online documentation shortcut will be created ',
      'info'
    )),
  createValidator('license') // Include license in installer
    .add(valueExist()),
  createValidator('licenseSourceFile') // Check License File, if any
    .add(createTest(
      (value) => value !== undefined,
      'Unable to find LICENSE or LICENCE.md file. License page will be skipped',
      'info'
    )),
  createValidator('icon') // Icon of the app
    .add(checkExt(['.ico', '.png'], 'Only .ico or .png file are supported for icon'))
    .add(isFileExists()),
  createValidator('banner') // Installer: Image for the right part of the top banner
    .add(checkExt(['.png', '.jpg', '.jpeg'], 'Banner must be either a jpeg or a png image.'))
    .add(isFileExists()),
  createValidator('background') // Installer: Image for the left panel
    .add(checkExt(['.png', '.jpg', '.jpeg'], 'Background must be either a jpeg or a png image.'))
    .add(isFileExists()),
  createValidator('color') // Installer: 'background' color
    .add(valueExist()),
  createValidator('dir') // Build directory
    .add(valueExist()),
  createValidator('useFiles') // Base mapping of sources on 'files' entry of package.json
    .add(valueExist()),
  createValidator('moduleFiles').add(createTest( // Tgt files (glob) if useFiles
    (value) => value && value.length,
    'No \'files\' entry in package.json'
  ))
]

// ////////////////////////////////
// ////////////////////////////////
// Utility functions
// ////////////////////////////////
// ////////////////////////////////

const undefinedValue = (message, level = 'error') => createTest(
  (value) => undefined !== value,
  message ?? 'Value is undefined',
  level
)

const trimmedValueNotEmpty = (message) => createTest(
  (value) => undefined !== value ? value.trim() : true,
  message ?? 'Value is empty/blank'
)

const valueExist = (message) => createTest(
  (value) => undefined !== value,
  message ?? 'Value not provided'
)

const checkExt = (exts, message) => createTest(
  (value) => undefined !== exts.find(ext => value.endsWith(ext)),
  message
)

const isFileExists = _ => createTest(
  (value) => fs.existsSync(value),
  'File does not exist'
)
