/**
 * Emit events to web socket
 * @function asSocket
 * @param {string} url - Web socket url
 * @param {Object} options - Optional settings
 * @param {string} options.prefix - Prefix of event name
 * @param {boolean} options.raw - Emit raw events
 * @returns {Object} socket
 */
'use strict'

const sgSocketClient = require('sg-socket-client')
const KinectFire = require('./kinect_fire')

/* @lends asSocket */
function asSocket (url, options = {}) {
  let socket = sgSocketClient(url)
  let fire = new KinectFire()
  let prefix = options.hasOwnProperty('prefix') ? options.prefix : 'kinnect'

  let pipe = (event) => {
    let pipeEvent = [ prefix, event ].filter((component) => !!component).join(':')
    fire.on(event, (data) => {
      socket.emit(pipeEvent, data)
    })
  }

  pipe('detection')
  if (options.raw) {
    pipe('raw')
  }
  return socket
}

module.exports = asSocket
