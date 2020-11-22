/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const axios = require('axios')
const unzipper = require('unzipper')
const { WIX_FOLDER } = require('./util/misc')

const url = 'https://github.com/wixtoolset/wix3/releases/download/wix3112rtm/wix311-binaries.zip'

const f = async _ => {
  const data = (await axios({ url, method: 'get', responseType: 'stream' })).data
  data.pipe(unzipper.Extract({ path: WIX_FOLDER }))
}

f()
