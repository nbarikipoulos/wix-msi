#  WIX-MSI

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

Package node.js application to a standalone executable and pack it into a msi installer (Windows only).

- Create a standalone binary that does not require node,
- Pack it in a windows msi installer that:
  - Extract info from package.json such as bin name, provider's name, and so on,
  - Automatically create a license panel in installer from LICENSE/LICENSE.md file, if any,
  - Automatically create in the windows start menu an entry that contains link to the homepage URL filled in package.json or provided in cli,
  - Automatically update the PATH environmement variable with the install folder.

## Install

As this module introduces a contraints to both target os and arch (respectively  win32 and x64), install it globally, as an optional dependency or launch it using npx to avoid to constrain your module with these settings.

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
-l / --license | include license panel in msi installer (Done if a LICENSE or LICENSE.md file is found) | boolean | true
-e / --exe | modify the executable name | string | package.bin[target_bin]
-d / --dir | build folder | path(*) | ./build
-H / --homepage | URL of the shortcut added to menu directory (not added if undefined) | URL | package.homepage
-i / --ico | Icon displayed in application panel (.ico or png file). Note png file will be automatically resized to a 256x256 image | path(*) | assets/prompt.png from this module
-b / --banner | Top banner displayed in msi panels (493x58 jpeg file with .jpg or .jpeg extension) | path(*) | assets/banner.jpg from this module
-B / --background | Background displayed in msi panels (493x312 jpeg file with .jpg or .jpeg extension) | path(*) | assets/background.jpg from this module
-U / --uuid | Product unique identifier | uuid  | automatically generated if not provided (and saved in wixrc file)
-s / --save | Save settings in .wixrc file | boolean  | n.a.
(*) path must be relative from the execution directory.
## Rc file

A .wixrc file could be use to store options:

```json
{
  "target-bin": {
    "uuid": "12345678-90ab-cdef-1234-567890abcde",
    "icon": "./myIcon.png"
  }
}
```

Or will be generated using the -s/--save option.

## Known Limitations

- Package version should follow the x.y.z format (it does not work with beta/rc or other usual suffix of node module version). If not, the pre-validation step will raise and
error and stop the packaging.



## Versioning

While it's still in beta, version will follow v0.Y.Z, where:
- Y: Major (could imply breaking changes),
- Z: Minor or patch.

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