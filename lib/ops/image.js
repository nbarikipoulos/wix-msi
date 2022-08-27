'use strict'

const sharp = require('sharp')

const FULL_WIDTH = 493
const PANEL_WIDTH = 176
const PANEL_HEIGHT = 312
const BANNER_HEIGHT = 58

const DELTA = 10
const UPPER_RIGHT_IMG_WIDTH_MAX = 100 - DELTA
const UPPER_RIGHT_IMG_HEIGHT_MAX = BANNER_HEIGHT - DELTA

const DEFAULT_BG_COLOR = 'white'

const createBackground = (src, tgt, color = DEFAULT_BG_COLOR) => createElement(
  src,
  tgt,
  FULL_WIDTH,
  PANEL_HEIGHT,
  color,
  composeIntroBackground
)

const createBanner = (src, tgt, color = DEFAULT_BG_COLOR) => createElement(
  src,
  tgt,
  FULL_WIDTH,
  BANNER_HEIGHT,
  color,
  composeBanner
)

const composeIntroBackground = (bgImage, srcImage) => srcImage
  .resize(PANEL_WIDTH, PANEL_HEIGHT)
  .toBuffer()
  .then(buffer => compose(
    bgImage,
    buffer
  ))

const composeBanner = async (bgImage, srcImage) => {
  const metadata = await srcImage.metadata()
  const ratio = metadata.width / metadata.height

  const width = ratio < 1.2
    ? UPPER_RIGHT_IMG_HEIGHT_MAX // "tail" (small ratio) and almost squared images
    : UPPER_RIGHT_IMG_WIDTH_MAX // "large" image

  const height = UPPER_RIGHT_IMG_HEIGHT_MAX

  return srcImage
    .resize(width, height)
    .toBuffer()
    .then(buffer => compose(
      bgImage,
      buffer,
      FULL_WIDTH - width - DELTA,
      DELTA / 2
    ))
}

const createElement = async (
  src,
  tgt,
  width,
  height,
  color,
  imageComposer = (bgImage, srcImage) => bgImage // Id
) => {
  const img = await createImage(width, height, color)

  if (src) {
    const srcImage = await sharp(src)
    await imageComposer(img, srcImage)
  }

  return saveJpeg(img, tgt)
}

const compose = (img, buffer, left = 0, top = 0) => img.composite([{
  input: buffer,
  left,
  top
}])

const createImage = (width, height, color) => sharp({
  create: {
    width,
    height,
    channels: 4,
    background: color
  }
})

const saveJpeg = (img, tgt) => img
  .jpeg({ quality: 100 })
  .toFile(tgt)

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createBackground,
  createBanner
}
