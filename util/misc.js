/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

const path = require('path')
const fs = require('fs')

const innerPath = (...innerPaths) => path.resolve(__dirname, '..', ...innerPaths)

const doExecPromise = (test, promiseProvider) => test ? promiseProvider() : Promise.resolve(null)

const getPackageData = (props = ['bin', 'version', 'author', 'homepage']) => {
  const packageFile = path.resolve(process.cwd(), 'package.json')
  const json = JSON.parse(fs.readFileSync(packageFile, 'utf8'))

  return props.reduce((acc, prop) => {
    acc[prop] = json[prop]
    return acc
  }, {})
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  innerPath,
  WIX_FOLDER: innerPath('wix_bin'),
  getPackageData,
  doExecPromise
}
