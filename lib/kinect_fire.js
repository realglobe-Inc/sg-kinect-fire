/**
 * Fire kinect event
 * @class KinectFire
 */
'use strict'

const EventEmitter = require('events')
const assert = require('assert')
const combineReducer = require('./reducing/combine_reducer')
const equal = require('deep-equal')

class KinectFire extends EventEmitter {
  constructor (config = {}) {
    super()
    const s = this
    s._reducer = combineReducer(config.reducers)
    s._working = {}
  }

  /**
   * Handle data
   * @param raw
   */
  handle (raw) {
    const s = this
    let detected = s.reduce(raw)
    let known = equal(s._working.detected, detected)
    if (!known) {
      s.emit('detect', detected)
    }
    s.emit('raw', raw)
    s._working = { raw, detected }
  }

  /**
   * Reduce data with reducers.
   * @param {Object} raw - Raw data
   * @returns {*}
   */
  reduce (raw) {
    const s = this
    if (Array.isArray(raw)) {
      return raw.map((data) => s.reduce(data))
    }
    return s._reducer(raw)
  }
}

module.exports = KinectFire
