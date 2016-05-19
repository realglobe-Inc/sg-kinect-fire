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
    s._bodyReducer = combineReducer(config.bodyReducers || {})
    s._bodies = {}
    s._kinect = null
  }

  /**
   * Handle data
   * @param raw
   */
  handleBody (raw) {
    const s = this
    let { bodyIndex } = raw
    let bodies = s._bodies[ bodyIndex ]
    let detected = s.reduceBody(raw)
    let known = equal(bodies && bodies.detected, detected)
    if (!known) {
      s.emit('body:detect', detected)
    }
    s.emit('body:raw', raw)
    s._bodies[ bodyIndex ] = { raw, detected }
  }

  /**
   * Reduce data with reducers.
   * @param {Object} raw - Raw data
   * @returns {*}
   */
  reduceBody (raw) {
    const s = this
    if (Array.isArray(raw)) {
      return raw.map((data) => s.reduceBody(data))
    }
    
    let { tracked, bodyIndex, trackingId } = raw
    let reduced = tracked ? s._bodyReducer(raw) : {}

    return Object.assign({ tracked, bodyIndex, trackingId }, reduced)
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
        .forEach((body) => s.handleBody(body))
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
