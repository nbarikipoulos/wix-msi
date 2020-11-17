/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const colors = require('colors')

class ErrMsg {
  constructor (level, message) {
    this._level = level || 'ok'
    this.message = message
    this._sub = []
  }

  get level () { return this._level }
  set level (value) {
    if (LEVEL[this._level] < LEVEL[value]) {
      this._level = value
    }
  }

  add (level, message) {
    this._sub.push(new ErrMsg(level, message))
    this.level = level
  }

  addMessage (msg) { this.msg.push(msg) }

  prettify (details = false) {
    let tree = prettifyError(this._level, this.message)

    if (details) {
      this._sub.forEach((elt) => {
        if (elt.level !== 'ok') {
          tree += '\n  ' + elt.message
        }
      })
    }
    return tree
  }
}

const LEVEL = {
  ok: 0,
  info: 1,
  warning: 2,
  error: 3
}

const prettifyError = (level, message) => {
  let msg = ''

  switch (level) {
    case 'ok': msg += colors.green.inverse('OK'); break
    case 'info': msg += colors.blue.inverse('INFO'); break
    case 'warning': msg += colors.yellow.inverse('WARNING'); break
    case 'error': msg += colors.red.inverse('ERROR'); break
    default: /* Do nothing */
  }

  if (message) {
    msg += ` ${message}`
  }

  return msg
}

module.exports = {
  createMessage: (level = 'ok', message = 'dddd') => new ErrMsg(level, message),
  prettifyError
}
