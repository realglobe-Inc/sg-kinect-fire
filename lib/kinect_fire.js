/**
 * Fire kinect event
 * @class KinectFire
 */
'use strict'

const EventEmitter = require('events')
const assert = require('assert')
const combineReducer = require('./reducing/combine_reducer')
const equal = require('deep-equal')
const kinect2 = require('./kinect/kinect2')

class KinectFire extends EventEmitter {
  constructor (config = {}) {
    super()
    const s = this
    s._reducer = combineReducer(config.reducers)
    s._working = {}
    s._kinnect = null
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
      s.emit('detection', detected)
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

  /**
   * Start firing
   */
  start () {
    const s = this
    s._kinnect = kinect2()
    let { _kinnect } = s
    let opened = _kinnect.open()
    if (!opened) {
      throw new Error('Failed to open kinnect')
    }
    _kinect.on('bodyFrame', (bodyFrame) => {
    })
      _kinnect.openBodyReader()
  }

  /**
   * Stop firing
   */
  stop () {
    const s = this
    let { _kinnect } = s
    if (_kinnect) {
      _kinnect.close()
    }
  }
}

module.exports = KinectFire
