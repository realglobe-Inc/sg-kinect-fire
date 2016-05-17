/**
 * Test case for kinectFire.
 * Runs with mocha.
 */
'use strict'

const KinectFire = require('../lib/kinect_fire.js')
const assert = require('assert')
const co = require('co')

const { jointTypes } = require('sg-kinect-constants')

const mockBodyFrame = require('../doc/mocks/mock-body-frame')
describe('kinect-fire', () => {
  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Kinect fire', () => co(function * () {
    let { HEAD, HAND_LEFT, SPINE_BASE } = jointTypes
    let fire = new KinectFire({
      reducers: {
        leftHandHigherThanHead: (frame) => (frame.joints[ HAND_LEFT ].cameraY > frame.joints[ HEAD ].cameraY),
        spineBaseLowerThanHead: (frame) => (frame.joints[ SPINE_BASE ].cameraY < frame.joints[ HEAD ].cameraY)
      }
    })
    let reduced = fire.reduce(mockBodyFrame)
    assert.deepEqual(reduced, [
      { leftHandHigherThanHead: false, spineBaseLowerThanHead: true }
    ])

    yield new Promise((resolve) => {
      fire.on('frame:detect', (detected) => {
        assert.ok(detected)
        assert.deepEqual(detected, [
          { leftHandHigherThanHead: false, spineBaseLowerThanHead: true }
        ])
        resolve()
      })
      fire.handleFrame(mockBodyFrame)
    })

    yield new Promise((resolve) => {
      fire.on('frame:raw', (raw) => {
        assert.ok(raw)
        resolve()
      })
      fire.handleFrame(mockBodyFrame)
    })
  }))
})

/* global describe, before, after, it */
