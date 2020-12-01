/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { promises: pfs } = require('fs')
const { create, fragment } = require('xmlbuilder2')
const { v4: uuid } = require('uuid')

module.exports = async (wixFilePath, config = {}) => {
  const content = createDocument()
    .root()
    .import(createDefines(config))
    .import(createProduct())
    .end({ prettyPrint: true })

  await pfs.writeFile(
    wixFilePath,
    content
  )
}

const createDocument = _ => {
  return create({ version: '1.0' }).ele({
    Wix: {
      '@xmlns': 'http://schemas.microsoft.com/wix/2006/wi',
      '@xmlns:util': 'http://schemas.microsoft.com/wix/UtilExtension'
    }
  })
}

const createDefines = (config) => {
  const defines = [
    `define ProductName="${config.productName}"`,
    'define ProductDescription="$(var.ProductName) utility."',
    `define ProductProvider="${config.productProvider}"`,
    `define ProductVersion="${config.version}"`,
    `define UpgradeCode="${config.upgradeCode}"`,
    `define PathToExe="${config.pathToExe}"`,
    `define PathToIco="${config.icon.file}"`,
    `define PathToBackground="${config.background.file}"`,
    `define PathToBanner="${config.banner.file}"`,
    `define OnlineDocumentation="${config.homepage}"`,
    `define SkipLicense="${config.license.skip}"`,
    `define WelcomeDialogPanelNext="${config.license.skip ? 'InstallDirDlg' : 'LicenseAgreementDlg'}"`,
    `define InstallDirDialogPanelBack="${config.license.skip ? 'WelcomeDlg' : 'LicenseAgreementDlg'}"`,
    `define PathToLicense="${config.license.file}"`,
    'define RegistryKeyPath="SOFTWARE\\$(var.ProductName)\\$(var.ProductVersion)"'
  ]

  return fragment().ins(defines)
}

const createProduct = _ => {
  const productObj = {
    Product: {
      '@Id': '*',
      '@Name': '$(var.ProductName)',
      '@Language': 1033,
      '@Version': '$(var.ProductVersion)',
      '@Manufacturer': '$(var.ProductProvider)',
      '@UpgradeCode': '$(var.UpgradeCode)',
      Package: {
        '@Compressed': 'yes',
        '@Manufacturer': '$(var.ProductProvider)',
        '@Description': '$(var.ProductDescription)',
        '@Comments': '(c) $(var.ProductProvider)'
      },
      MediaTemplate: { '@EmbedCab': 'yes' },
      MajorUpgrade: { '@DowngradeErrorMessage': 'A newer version of [ProductName] is already installed.' },
      Icon: { '@Id': 'appIco', '@SourceFile': '$(var.PathToIco)' },
      Property: [
        { '@Id': 'ARPPRODUCTICON', '@Value': 'appIco' },
        { '@Id': 'ARPNOREPAIR', '@Value': 'yes', '@Secure': 'yes' },
        { '@Id': 'ARPNOMODIFY', '@Value': 'yes', '@Secure': 'yes' },
        { '@Id': 'ApplicationFolderName', '@Value': 'PoppyCLI' },
        { '@Id': 'WIXUI_INSTALLDIR', '@Value': 'INSTALLDIR' },
        {
          '@Id': 'INSTALLDIR',
          RegistrySearch: {
            '@Id': 'InstallPathRegistry',
            '@Type': 'raw',
            '@Root': 'HKCU',
            '@Key': '$(var.RegistryKeyPath)',
            '@Name': 'InstallPath'
          }
        }
      ],
      Feature: {
        '@Id': 'Poppy_CLI',
        '@Level': 1,
        '@Title': '$(var.ProductName)',
        '@Description': 'Install the $(var.ProductName) executable',
        '@Absent': 'disallow',
        ComponentGroupRef: { '@Id': 'ProductComponents' },
        ComponentRef: { '@Id': 'ApplicationShortcuts' }
      },
      Directory: {
        '@Id': 'TARGETDIR',
        '@Name': 'SourceDir',
        Directory: [
          { '@Id': 'ProgramFiles64Folder', Directory: { '@Id': 'INSTALLDIR', '@Name': '$(var.ProductName)' } },
          { '@Id': 'ProgramMenuFolder', Directory: { '@Id': 'ApplicationStartMenuDirectory', '@Name': '$(var.ProductName)' } }
        ]
      },
      ComponentGroup: {
        '@Id': 'ProductComponents',
        '@Directory': 'INSTALLDIR',
        Component: {
          '@Id': 'Executable',
          '@Guid': uuid(),
          File: { '@Id': 'ApplicationFile', '@Source': '$(var.PathToExe)', '@Vital': 'yes' },
          RemoveFolder: { '@Id': 'INSTALLDIR', '@On': 'uninstall' }
        },
        ComponentRef: { '@Id': 'Path' }
      },
      DirectoryRef: [{
        '@Id': 'ApplicationStartMenuDirectory',
        Component: {
          '@Id': 'ApplicationShortcuts',
          '@Guid': uuid(),
          '?if': 'if $(var.OnlineDocumentation) != "undefined"',
          'util:InternetShortcut': {
            '@Id': 'OnlineDocumentationShortcut',
            '@Name': 'Online Documentation',
            '@IconFile': 'appIco',
            '@Target': '$(var.OnlineDocumentation)'
          },
          '?endif': 'endif',
          Shortcut: {
            '@Id': 'ApplicationUninstallShortcut',
            '@Name': 'Uninstall $(var.ProductName) $(var.ProductVersion)',
            '@Directory': 'ApplicationStartMenuDirectory',
            '@Target': '[SystemFolder]msiexec.exe',
            '@Arguments': '/x [ProductCode]'
          },
          RemoveFolder: { '@Id': 'ApplicationStartMenuDirectory', '@On': 'uninstall' },
          RegistryValue: { '@Root': 'HKCU', '@Key': '($var.RegistryKeyPath)', '@Name': 'installed', '@Type': 'integer', '@Value': 1, '@KeyPath': 'yes' }
        }
      }, {
        '@Id': 'TARGETDIR',
        Component: {
          '@Id': 'Path',
          '@Guid': uuid(),
          Environment: { '@Id': 'PATH', '@Name': 'PATH', '@Value': '[INSTALLDIR]', '@Permanent': 'no', '@Part': 'last', '@Action': 'set', '@System': 'yes' }
        }
      }],
      UI: {
        UIRef: { '@Id': 'WixUI_Common' },
        TextStyle: [
          { '@Id': 'WixUI_Font_Normal', '@FaceName': 'Tahoma', '@Size': 8, '@Red': 0, '@Green': 0, '@Blue': 0 },
          { '@Id': 'WixUI_Font_Bigger', '@FaceName': 'Tahoma', '@Size': 12, '@Red': 0, '@Green': 0, '@Blue': 0 },
          { '@Id': 'WixUI_Font_Title', '@FaceName': 'Tahoma', '@Size': 9, '@Red': 0, '@Green': 0, '@Blue': 0 }
        ],
        Property: [
          { '@Id': 'DefaultUIFont', '@Value': 'WixUI_Font_Normal' },
          { '@Id': 'WixUI_Mode', '@Value': 'InstallDir' },
          { '@Id': 'WIXUI_EXITDIALOGOPTIONALTEXT', '@Value': '$(var.ProductName) has been successfully installed.' }
        ],
        DialogRef: [
          { '@Id': 'ErrorDlg' },
          { '@Id': 'FatalError' },
          { '@Id': 'FilesInUse' },
          { '@Id': 'MsiRMFilesInUse' },
          { '@Id': 'PrepareDlg' },
          { '@Id': 'ProgressDlg' },
          { '@Id': 'ResumeDlg' },
          { '@Id': 'UserExit' },
          { '@Id': 'WelcomeDlg' },
          { '@Id': 'LicenseAgreementDlg' },
          { '@Id': 'InstallDirDlg' },
          { '@Id': 'BrowseDlg' },
          { '@Id': 'InvalidDirDlg' }
        ],
        Publish: [
          { '@Dialog': 'WelcomeDlg', '@Control': 'Next', '@Event': 'NewDialog', '@Value': '$(var.WelcomeDialogPanelNext)', '#': 'NOT Installed' },
          { '@Dialog': 'WelcomeDlg', '@Control': 'Next', '@Event': 'NewDialog', '@Value': 'VerifyReadyDlg', '#': 'Installed AND PATCH' },
          { '@Dialog': 'LicenseAgreementDlg', '@Control': 'Back', '@Event': 'NewDialog', '@Value': 'WelcomeDlg', '#': 1 },
          { '@Dialog': 'LicenseAgreementDlg', '@Control': 'Next', '@Event': 'NewDialog', '@Value': 'InstallDirDlg', '#': 'LicenseAccepted = "1"' },
          { '@Dialog': 'InstallDirDlg', '@Control': 'Back', '@Event': 'NewDialog', '@Value': '$(var.InstallDirDialogPanelBack)', '#': 1 },
          { '@Dialog': 'InstallDirDlg', '@Control': 'Next', '@Event': 'NewDialog', '@Value': 'VerifyReadyDlg', '@Order': 20, '#': 1 },
          { '@Dialog': 'InstallDirDlg', '@Control': 'Next', '@Event': 'SetTargetPath', '@Value': '[WIXUI_INSTALLDIR]', '@Order': 10, '#': 1 },
          { '@Dialog': 'InstallDirDlg', '@Control': 'ChangeFolder', '@Property': '_BrowseProperty', '@Value': '[WIXUI_INSTALLDIR]', '@Order': 10, '#': 1 },
          { '@Dialog': 'InstallDirDlg', '@Control': 'ChangeFolder', '@Event': 'SpawnDialog', '@Value': 'BrowseDlg', '@Order': 20, '#': 1 },
          { '@Dialog': 'ExitDialog', '@Control': 'Finish', '@Event': 'EndDialog', '@Value': 'Return', '@Order': 999, '#': 1 },
          { '@Dialog': 'VerifyReadyDlg', '@Control': 'Back', '@Event': 'NewDialog', '@Value': 'InstallDirDlg', '@Order': 1, '#': 'NOT Installed OR WixUI_InstallMode = "Change"' },
          { '@Dialog': 'VerifyReadyDlg', '@Control': 'Back', '@Event': 'NewDialog', '@Value': 'WelcomeDlg', '@Order': 3, '#': 'Installed AND PATCH' }
        ]
      },
      WixVariable: [
        { '@Id': 'WixUIBannerBmp', '@Value': '$(var.PathToBanner)' },
        { '@Id': 'WixUIDialogBmp', '@Value': '$(var.PathToBackground)' }
      ]
    }
  }

  const product = fragment(productObj)

  product.first().ele({
    '?if': 'if $(var.SkipLicense) != "true"',
    WixVariable: { '@Id': 'WixUILicenseRtf', '@Value': '$(var.PathToLicense)' },
    '?endif': 'endif'
  })

  return product
}
