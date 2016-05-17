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
    s._kinect = null
  }

  /**
   * Handle data
   * @param raw
   */
  handleBody (raw) {
    const s = this
    let detected = s.reduce(raw)
    let known = equal(s._working.detected, detected)
    if (!known) {
      s.emit('frame:detect', detected)
    }
    s.emit('frame:raw', raw)
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
    s._kinect = KinectFire.kinect2()
    let { _kinect } = s
    let opened = _kinect.open()
    if (!opened) {
      throw new Error('Failed to open kinect')
    }
    _kinect.on('bodyFrame', (frame) =>
      frame.bodies
        .filter((body) => body.tracked)
        .forEach((body) => {
          s.handleBody(body)
        })
    )
    _kinect.openBodyReader()
  }

  /**
   * Stop firing
   */
  stop () {
    const s = this
    let { _kinect } = s
    if (_kinect) {
      _kinect.close()
    }
  }
}

Object.assign(KinectFire, {
  kinect2
})

module.exports = KinectFire
