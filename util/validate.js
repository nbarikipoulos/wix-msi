/*! Copyright (c) 2020-21 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const colors = require('colors')

class ValidationMsg {
  constructor (level, message) {
    this._level = level || 'ok'
    this._message = message
    this._children = []
  }

  get level () { return this._level }
  get message () { return this._message }
  get children () { return this._children }

  set level (value) {
    if (LEVEL[this._level] < LEVEL[value]) {
      this._level = value
    }
  }

  add (msg) {
    this._children.push(msg)
    this.level = msg.level
  }
}

const LEVEL = {
  ok: 0,
  info: 1,
  warning: 2,
  error: 3
}

class Test {
  constructor (test, message, level = 'error') {
    this._message = message
    this._level = level
    this._test = test
  }

  perform (value) {
    const test = this._test(value)

    const [level, message] = test
      ? ['ok', `${value}`]
      : [this._level, this._message]

    return new ValidationMsg(level, message)
  }
}

class Validator {
  constructor (name) {
    this._name = name
    this._tests = []
  }

  get name () { return this._name }
  get tests () { return this._tests }

  add (test) { this._tests.push(test); return this }

  perform (value) {
    const result = new ValidationMsg('ok', `${this.name}: '${value}'`)

    for (const test of this.tests) {
      result.add(test.perform(value))
    }

    return result
  }
}

const doValidate = (values, validators) => {
  let isError = false

  for (const prop in values) {
    const validator = validators.find(
      validator => validator.name === prop
    )
    if (validator) {
      const validation = validator.perform(values[prop])
      const level = validation.level
      isError |= level === 'error'
      console.log(_prettify(validation))
    } else {
      console.log(_prettify(new ValidationMsg('info', `${prop}: Not checked (no validator found)`)))
    }
  }

  return isError
}

const _prettify = (errMsg, showDetails = true) => {
  // "Header"
  let result = ''

  switch (errMsg.level) {
    case 'ok': result += colors.green.inverse('OK'); break
    case 'info': result += colors.blue.inverse('INFO'); break
    case 'warning': result += colors.yellow.inverse('WARNING'); break
    case 'error': result += colors.red.inverse('ERROR'); break
    default: /* Do nothing */
  }

  if (errMsg.message) { result += ` ${errMsg.message}` }

  if (showDetails) {
    result += errMsg.children.reduce((acc, child) => {
      if (child.level !== 'ok') {
        acc += `\n  ${child.message}`
      }
      return acc
    }, '')
  }

  return result
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createTest: (test, message, level) => new Test(test, message, level),
  createValidator: (name) => new Validator(name),
  doValidate
}
