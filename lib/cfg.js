/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path').win32

const { v4: generateUuid } = require('uuid')

module.exports = (
  name,
  froms = ['default', 'pkg', 'rc'],
  extra = {}
) => {
  const option = {
    name,
    ...configDEFAULT(name),
    ...configPkg(name),
    ...configRC(name),
    ...extra
  }

  const config = getConfig(option)

  return config
}

const getConfig = ({
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

  const licenseFile = path.resolve(process.cwd(), 'license.rtf')

  const productName = name
  const binName = name
  const icoFile = ico
  const bannerFile = path.resolve(banner)
  const backgroundFile = path.resolve(background)
  const upgradeCode = uuid || generateUuid()

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

const configDEFAULT = (name) => ({
  exe: name,
  skipLicense: false,
  buildDir: 'build',
  ico: 'assets/prompt.ico',
  banner: 'assets/banner.jpg',
  background: 'assets/background.jpg'
})

const configPkg = (name) => {
  const packageFile = path.resolve(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'))

  return {
    entry: pkg.bin[name],
    version: pkg.version,
    productProvider: pkg.author,
    homepage: pkg.homepage
  }
}

const configRC = (name) => {
  let option = {}
  try {
    const configFile = path.resolve(process.cwd(), '.wixrc')
    const wixrc = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    option = wixrc[name]
  } catch (error) { /* Do nothing */ }

  return option
}
