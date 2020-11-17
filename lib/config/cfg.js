/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const path = require('path').win32

const validate = require('./validate')

module.exports = (
  name,
  config = {}
) => {
  const option = {
    name,
    ...config
  }
  const v = validate(option)

  v.display()

  return !v.isError ? doCreateConfig(v.value) : undefined
}

const doCreateConfig = ({
  exe = undefined,
  name = undefined,
  skipLicense = undefined,
  licenseSourceFile = undefined,
  buildDir = undefined,
  ico = undefined,
  entry,
  version,
  author,
  homepage = undefined,
  banner = undefined,
  background = undefined,
  uuid = undefined
} = {}) => {
  const buildDirPath = path.resolve(process.cwd(), buildDir)

  const licenseFile = path.resolve(buildDirPath, 'license.rtf')

  const productName = name
  const binName = name
  const icoFile = ico
  const bannerFile = path.resolve(banner)
  const backgroundFile = path.resolve(background)
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
      icoFile,
      homepage: homepage,
      banner: bannerFile,
      background: backgroundFile,
      license: {
        skip: skipLicense || !licenseSourceFile,
        src: licenseSourceFile,
        file: licenseFile
      }
    }
  }
}
