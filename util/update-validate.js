/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { getFuncArgs } = require('./misc')
const { createMessage } = require('./err-msg')

class UpdateNValidate {
  constructor (descs) {
    this._descs = descs
    this._result = undefined // { option: { value, validation }}
  }

  get isError () {
    const idx = Object.values(this._result).findIndex(e => e.validation.level === 'error')
    return idx !== -1
  }

  get value () {
    return Object.entries(this._result).reduce(
      (acc, [k, v]) => ({ ...acc, ...{ [k]: v.value } }),
      {}
    )
  }

  perform (input) {
    this._result = {}
    for (const desc of this._descs) {
      const option = desc.name
      let current = input[option]
      if (
        current === undefined &&
        'default' in desc
      ) {
        current = this._doSetDefaultValue(desc.default)
      }

      const validation = createMessage('ok', `${option}: '${current}'`)

      if ('validator' in desc) {
        const validators = Array.isArray(desc.validator)
          ? desc.validator
          : [desc.validator]

        validators.forEach(validator => {
          const err = this._doValidate(current, validator)
          validation.add(err.level, err.message)
        })
      }

      this._result[option] = {
        value: current,
        validation
      }
    }
  }

  display () {
    console.log('> Check config')
    for (const p in this._result) {
      const level = this._result[p].validation.level
      console.log(
        this._result[p].validation.prettify(level !== 'ok')
      )
    }
  }

  _doSetDefaultValue (fn) {
    const argValues = getFuncArgs(fn)
      .map(prop => this._result[prop].value)

    return fn(...argValues)
  }

  _doValidate (value, validator) {
    const argValues = getFuncArgs(validator)
      .filter(n => n !== 'value')
      .map(prop => this._result[prop].value)

    return validator(value, ...argValues)
  }
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  factory: (input) => {
    return new UpdateNValidate(input)
  },
  createValidator: (test, message, level = 'error') => createMessage(
    test ? 'ok' : level,
    !test ? message : 'OK'
  )
}
