/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path').win32

module.exports = (
  name,
  config = {}
) => {
  const option = {
    name,
    ...fromDEFAULT(name),
    ...fromPkg(name),
    ...config
  }

  return doCreateConfig(option)
}

const fromDEFAULT = (name) => ({
  exe: name,
  skipLicense: false,
  buildDir: 'build',
  ico: 'assets/prompt.ico',
  banner: 'assets/banner.jpg',
  background: 'assets/background.jpg'
})

const fromPkg = (name) => {
  const { bin, version, author, homepage } = require('../package.json')
  return {
    entry: bin[name],
    version,
    homepage,
    productProvider: author
  }
}

const doCreateConfig = ({
  exe = undefined,
  name = undefined,
  skipLicense = undefined,
  buildDir = undefined,
  ico = undefined,
  entry,
  version,
  productProvider,
  homepage = undefined,
  banner = undefined,
  background = undefined,
  uuid = undefined
} = {}) => {
  const buildDirPath = path.resolve(process.cwd(), buildDir)

  const srcLicenseFile = ['LICENSE', 'LICENSE.md']
    .map(fname => path.join(process.cwd(), fname))
    .find(p => fs.existsSync(p))

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
      productProvider,
      pathToExe: singleExePath,
      version,
      upgradeCode,
      icoFile,
      homepage: homepage,
      banner: bannerFile,
      background: backgroundFile,
      license: {
        skip: skipLicense || !srcLicenseFile,
        src: srcLicenseFile,
        file: licenseFile
      }
    }
  }
}
