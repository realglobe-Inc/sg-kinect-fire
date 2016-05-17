/**
 * Emit events to web socket
 * @class KinectSocketFire
 * @param {string} url - Web socket url
 * @param {Object} options - Optional settings
 * @param {string} options.prefix - Prefix of event name
 * @param {boolean} options.raw - Emit raw events
 * @returns {Object} socket
 */
'use strict'

const assert = require('assert')
const sgSocketClient = require('sg-socket-client')
const KinectFire = require('./kinect_fire')

class KinectSocketFire extends KinectFire {
  constructor (url, config = {}) {
    let { reducers, prefix, raw } = config
    assert.ok(url, 'url is required')
    super({ reducers })
    const s = this

    if (typeof prefix === 'undefined') {
      prefix = 'kinect'
    }
    Object.assign(s, { url, prefix, raw })
  }

  start () {
    super.start()
    const s = this

    let socket = sgSocketClient(s.url)
    socket.on('error', (err) => s.emit('error', err))
    s.socket = socket

    let pipe = (event) => {
      let pipeEvent = [ s.prefix, event ].filter((component) => !!component).join(':')
      s.on(event, (data) => socket.emit(pipeEvent, data))
    }

    pipe('frame:detect')
    if (s.raw) {
      pipe('frame:raw')
    }
  }

  stop () {
    super.stop()
    const s = this
    s.socket.close()
  }
}

module.exports = KinectSocketFire
