'use strict'

const { promises: pfs } = require('fs')
const axios = require('axios')
const unzipper = require('unzipper')
const { WIX_FOLDER } = require('./util/misc')

const url = 'https://github.com/wixtoolset/wix3/releases/download/wix3112rtm/wix311-binaries.zip'

const f = async _ => {
  let abort = false
  try {
    await pfs.access(WIX_FOLDER)
    abort = true
  } catch { /* Do nothing */ }

  if (!abort) {
    console.log(`Locally download wixtoolset from ${url}`)
    const data = (await axios({ url, method: 'get', responseType: 'stream' })).data
    data.pipe(unzipper.Extract({ path: WIX_FOLDER }))
  }
}

f()
