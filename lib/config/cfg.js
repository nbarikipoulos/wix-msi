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
  exe,
  name,
  skipLicense,
  licenseSourceFile,
  buildDir,
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
  const buildDirPath = path.resolve(process.cwd(), buildDir)

  const licenseFile = path.resolve(buildDirPath, 'license.rtf')

  const productName = name
  const binName = name
  const icoFile = icon.endsWith('.ico')
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
    buildDir: buildDirPath,
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
        skip: skipLicense || !licenseSourceFile,
        src: licenseSourceFile,
        file: licenseFile
      }
    }
  }
}
