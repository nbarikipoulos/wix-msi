/*! Copyright (c) 2020-22 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

const path = require('path')
const fs = require('fs')

const innerPath = (...innerPaths) => path.resolve(__dirname, '..', ...innerPaths)

const doExecPromise = (test, promiseProvider) => test ? promiseProvider() : Promise.resolve(null)

const getPackageData = (props = ['bin', 'version', 'author', 'homepage', 'files']) => {
  const json = loadJSON('package.json')

  return props.reduce((acc, prop) => {
    acc[prop] = json[prop]
    return acc
  }, {})
}

// load from current working directory.
// Return undefined if not found.
const loadJSON = (fileName) => {
  let result

  try {
    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), fileName),
      'utf8'
    )
    result = JSON.parse(buffer)
  } catch (error) { /* Do nothing */ }
  return result
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  innerPath,
  WIX_FOLDER: innerPath('wix_bin'),
  loadJSON,
  getPackageData,
  doExecPromise
}
