#  WIX-MSI

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

Pack node.js bin to a standalone executable and pack it in a msi installer (Windows only).

- Create a binary which does not require node,
- Pack it in a windows msi installer that:
  - Extract info from package.json such as bin name, provider's name, and so on,
  - Automatically create a license panel in installer from LICENSE/LICENSE.md file, if any,
  - Automatically create in the windows start menu an entry that contains link to the homepage URL filled in package.json,
  - Automatically update the PATH environmement variable with the install folder.

## Prerequisite

MSI build step is based on the wix toolset project and then, it should be installed. see [here](https://wixtoolset.org).
This module has been "tested" with the WIX release 3.11.2.

## Install

```shell
npm i wix-msi -g
```

## Use

```shell
wix-msi target_bin
```

## Options

option | desc | value | default
--- | --- | --- | ---
-l / --license | include license panel in msi installer | boolean | true
-e / --exe | modify the executable name | string | package.bin[target_bin]
-d / --dir | build folder | path | ./build
-H / --homepage | URL of the shortcut added to menu directory | URL | package.homepage
-i / --ico | Icon displayed in application panel (.ico file) | path | assets/prompt.ico from this module
-b / --banner | Top banner displayed in msi panels (493x58 jpg file) | path | assets/banner.jpg from this module
-B / --background | Background displayed in msi panels (493x312 jpg file) | path | assets/background.jpg from this module
-U / --uuid | Product unique identifier | uuid  | automatically generated if not provided (and saved in wixrc file)
-s / --save | Save settings in .wixrc file | boolean  | n.a.

## Rc file

A .wixrc file could be use to store options:

```json
{
  "target-bin": {
    "uuid": "12345678-90ab-cdef-1234-567890abcde",
    "ico": "./myIcon.ico"
  }
}
```

Or will be generated using the -s/--save option.

## Known Limitations

- Package version should follow the x.y.z format (it does not work with beta/rc or other usual prefix of node module version).



## Versioning

While it's still in beta, version will follow v0.Y.Z, where:
- Y: Major (could imply breaking changes)
- Z: Minor or patch

## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

This module is MIT licensed. See [LICENSE](./LICENSE.md).

[npm-url]: https://www.npmjs.com/package/wix-msi
[npm-image]: https://img.shields.io/npm/v/wix-msi.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[david-image]: https://img.shields.io/david/nbarikipoulos/wix-msi.svg
[david-url]: https://david-dm.org/nbarikipoulos/wix-msi
[david-dev-image]: https://img.shields.io/david/dev/nbarikipoulos/wix-msi.svg
[david-dev-url]: https://david-dm.org/nbarikipoulos/wix-msi?type=dev