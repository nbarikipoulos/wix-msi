/*! Copyright (c) 2020-22 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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

const _updateValue = (name, input = {}, packageData) => {
  // Update default path if needed
  // ('__package' with inner module location)
  // see details.default in ARGS
  const f = (v) => innerPath(v.replace('__package/', ''))

  const result = {
    name, // Target bin name
    uuid: input.uuid, // uuid
    version: packageData.version, // Version
    exe: input.exe ?? name, // Exe name
    entry: packageData?.bin[name], // Entry point
    author: input.author ?? packageData.author, // Author
    homepage: input.homepage ?? packageData.homepage, // Homepage
    license: input.license, // Include license in installer
    licenseSourceFile: input.license ? _getLicenseSourceFile() : undefined,
    icon: f(input.icon), // Icon of the app
    banner: f(input.banner), // Installer: Image for the right part of the top banner
    background: f(input.background), // Installer: Image for the left panel
    color: input.color, // Installer: 'background' color
    dir: input.dir // Build directory
  }

  // Clean-up license
  if (!input.license) {
    delete result.licenseSourceFile
  }

  return result
}

const _getLicenseSourceFile = _ => ['LICENSE', 'LICENSE.md']
  .map(fname => path.join(process.cwd(), fname))
  .find(p => fs.existsSync(p))

const _createConfig = ({
  exe,
  name,
  license,
  licenseSourceFile,
  dir,
  icon,
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
  const iconFile = icon.endsWith('.ico')
    ? icon
    : path.join(
      buildDirPath,
      path.basename(icon, path.extname(icon)) + '.ico'
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
        src: icon,
        file: iconFile
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
