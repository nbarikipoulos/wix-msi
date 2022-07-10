'use strict'

const { promises: pfs } = require('fs')
const Jimp = require('jimp')

const FULL_WIDTH = 493
const PANEL_WIDTH = 176
const PANEL_HEIGHT = 312
const BANNER_HEIGHT = 58

const DELTA = 10
const UPPER_RIGHT_IMG_WIDTH_MAX = 100 - DELTA
const UPPER_RIGHT_IMG_HEIGHT_MAX = BANNER_HEIGHT - DELTA

const DEFAULT_BG_COLOR = 'white'

const createBanner = async (src, tgt, color = DEFAULT_BG_COLOR) => {
  const banner = new Jimp(FULL_WIDTH, BANNER_HEIGHT, color)

  if (src) {
    const inputImage = await Jimp.read(src)

    const ratio = inputImage.bitmap.width / inputImage.bitmap.height

    const w = ratio < 1.2
      ? UPPER_RIGHT_IMG_HEIGHT_MAX // "tail" (small ratio) and almost squared images
      : UPPER_RIGHT_IMG_WIDTH_MAX // "large" image

    const h = UPPER_RIGHT_IMG_HEIGHT_MAX

    inputImage.resize(w, h).quality(100)

    banner.blit(inputImage, FULL_WIDTH - w - DELTA, DELTA / 2)
  }

  return saveJpeg(banner, tgt)
}

const createBackground = async (src, tgt, color = DEFAULT_BG_COLOR) => {
  const img = new Jimp(FULL_WIDTH, PANEL_HEIGHT, color)

  if (src) {
    const leftPanel = await Jimp.read(src)

    leftPanel.resize(PANEL_WIDTH, PANEL_HEIGHT).quality(100)

    img.blit(leftPanel, 0, 0)
  }

  return saveJpeg(img, tgt)
}

const saveJpeg = (img, tgt) => img.getBufferAsync(Jimp.MIME_JPEG)
  .then(buffer => pfs.writeFile(tgt, buffer))

module.exports = {
  createBackground,
  createBanner
}
