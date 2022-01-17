/*! Copyright (c) 2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')
const { exec: execPack } = require('pkg')
const { doExecPromise: p, getPackageData } = require('../../util/misc')
const path = require('path').win32

// name: tgt bin
// entry: entry script or build folder (if -f => moduleFiles !== undefined)
module.exports = async (name, entry, exe, moduleFiles) => p(
  moduleFiles,
  _ => createPkgConfigFile(name, entry)
).then(_ => pack(entry, exe))

// entry: target bin name or target dir (if -f)
const pack = (entry, exe) => execPack([entry, '--targets', 'win-x64', '--output', exe])

// Create a xxx.config.json file
const createPkgConfigFile = (name, file) => {
  const packageData = getPackageData(['bin', 'files'])

  const backPath = path.relative(path.dirname(file), '.')
  const f = (dir) => path.join(backPath, dir)

  const config = {
    bin: { [name]: f(packageData.bin[name]) },
    pkg: { scripts: packageData.files.map(f) }
  }

  return pfs.writeFile(
    path.resolve(process.cwd(), file),
    JSON.stringify(config, null, 2)
  )
}
