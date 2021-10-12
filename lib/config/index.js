/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path').win32

const getValidators = require('./validators')
const { doValidate, createTest, createValidator } = require('../../util/validate')
const { getPackageData, innerPath } = require('../../util/misc')

module.exports = (
  name,
  input = {}
) => {
  //
  // Update values with package ones.
  //
  const packageData = getPackageData()
  const data = _updateValue(name, input, packageData)

  //
  // Validate values
  //

  // Get validators
  const validators = getValidators()

  // Add validator for target bin name
  validators.push(createValidator('name')
    .add(createTest(
      (value) => packageData.bin[value],
      'Bin not found in package.json/bin'
    ))
  )

  // At last perform validation of input
  console.log('> Check input data')
  const isError = doValidate(data, validators)

  return !isError ? _createConfig(data) : undefined
}

const _updateValue = (name, argv, packageData) => {
  // Update default path if needed
  // ('__package' with inner module location)
  // see details.default in ARGS
  const f = (v) => v.startsWith('__package/')
    ? innerPath(v.replace('__package/', ''))
    : v

  const result = {
    name, // Target bin name
    uuid: argv.uuid, // uuid
    version: packageData.version, // Version
    exe: argv.exe ?? name, // Exe name
    entry: packageData?.bin[name], // Entry point
    author: argv.author ?? packageData.author, // Author
    homepage: argv.homepage ?? packageData.homepage, // Homepage
    license: argv.license, // Include license in installer
    licenseSourceFile: undefined,
    ico: f(argv.ico), // Icon of the app
    banner: f(argv.banner), // Installer: Image for the right part of the top banner
    background: f(argv.background), // Installer: Image for the left panel
    color: argv.color, // Installer: 'background' color
    dir: argv.dir // Build directory
  }

  const prop = 'licenseSourceFile'
  if (result.license) {
    result[prop] = ['LICENSE', 'LICENSE.md']
      .map(fname => path.join(process.cwd(), fname))
      .find(p => fs.existsSync(p))
  } else {
    delete result[prop]
  }

  return result
}

const _createConfig = ({
  exe,
  name,
  license,
  licenseSourceFile,
  dir,
  ico,
  entry,
  version,
  author,
  homepage,
  banner,
  background,
  color,
  uuid
} = {}) => {
  const buildDirPath = path.resolve(process.cwd(), dir)

  const licenseFile = path.resolve(buildDirPath, 'license.rtf')

  const productName = name
  const binName = name
  const icoFile = ico.endsWith('.ico')
    ? ico
    : path.join(
      buildDirPath,
      path.basename(ico, path.extname(ico)) + '.ico'
    )
  const bannerSourceFile = path.resolve(banner)
  const bannerFile = path.resolve(buildDirPath, 'banner.jpg')
  const backgroundSourceFile = path.resolve(background)
  const backgroundFile = path.resolve(buildDirPath, 'background.jpg')
  const upgradeCode = uuid // build will failed if not provided

  const [
    singleExePath,
    wixFilePath,
    wixObjFilePath,
    msiFilePath
  ] = [
    { name: exe, ext: '.exe' },
    { name: binName, ext: '.wxs' },
    { name: binName, ext: '.wixobj' },
    { name: `${name}-${version}`, ext: '.msi' }
  ].map(elt => path.format({ dir: buildDirPath, ...elt }))

  return {
    dir: buildDirPath,
    file: {
      exe: singleExePath,
      wix: wixFilePath,
      obj: wixObjFilePath,
      msi: msiFilePath
    },
    bin: {
      entry,
      exe: singleExePath
    },
    wxs: {
      productName,
      productProvider: author,
      pathToExe: singleExePath,
      version,
      upgradeCode,
      icon: {
        src: ico,
        file: icoFile
      },
      homepage: homepage,
      color,
      banner: {
        src: bannerSourceFile,
        file: bannerFile
      },
      background: {
        src: backgroundSourceFile,
        file: backgroundFile
      },
      license: {
        skip: !license || !licenseSourceFile,
        src: licenseSourceFile,
        file: licenseFile
      }
    }
  }
}
