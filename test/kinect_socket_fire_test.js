/**
 * Test case for asSocket.
 * Runs with mocha.
 */
'use strict'

const KinectFire = require('../lib/kinect_fire')
const KinectSocketFire = require('../lib/kinect_socket_fire')
const injectmock = require('injectmock')
const assert = require('assert')
const co = require('co')
const sgSocket = require('sg-socket')
const sgSocketClient = require('sg-socket-client')

describe('kinect-socket-fire', () => {
  const port = 9855
  let wsServer
  before(() => co(function * () {
    const kinect2 = require('../doc/mocks/mock-kinect2')
    injectmock(KinectFire, 'kinect2', kinect2)
    wsServer = sgSocket(port)
    wsServer.on('connection', (socket) => {
      let pipe = (event) => {
        socket.on(event, (data) => {
          socket.broadcast.emit(event, data)
        })
      }
      pipe('kinect:frame:detect')
    })
  }))

  after(() => co(function * () {
    injectmock.restoreAll()
    wsServer.close()
  }))

  it('As socket', () => co(function * () {
    let receiver = sgSocketClient(`http://localhost:${port}`)
    receiver.on('connect', () => {
    })
    yield new Promise((resolve) => {
      let fire = new KinectSocketFire(`http://localhost:${port}`, {
        reducers: {}
      })
      receiver.on('kinect:frame:detect', () => {
        fire.stop()
        resolve()
      })

      fire.start()
    })
  }))
})

/* global describe, before, after, it */
