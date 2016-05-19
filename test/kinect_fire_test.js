/**
 * Test case for kinectFire.
 * Runs with mocha.
 */
'use strict'

const KinectFire = require('../lib/kinect_fire.js')
const assert = require('assert')
const co = require('co')

const { jointTypes } = require('sg-kinect-constants')

const mockBodies = require('../doc/mocks/mock-bodies')
describe('kinect-fire', () => {
  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Kinect fire', () => co(function * () {
    let { HEAD, HAND_LEFT, SPINE_BASE } = jointTypes
    let fire = new KinectFire({
      bodyReducers: {
        leftHandHigherThanHead: (body) => (body.joints[ HAND_LEFT ].cameraY > body.joints[ HEAD ].cameraY),
        spineBaseLowerThanHead: (body) => (body.joints[ SPINE_BASE ].cameraY < body.joints[ HEAD ].cameraY)
      }
    })
    let reduced = fire.reduceBody(mockBodies)
    assert.deepEqual(reduced, [
      { leftHandHigherThanHead: false, spineBaseLowerThanHead: true }
    ])

    yield new Promise((resolve) => {
      fire.on('body:detect', (detected) => {
        assert.ok(detected)
        assert.deepEqual(detected, [
          { leftHandHigherThanHead: false, spineBaseLowerThanHead: true }
        ])
        resolve()
      })
      fire.handleBody(mockBodies)
    })

    yield new Promise((resolve) => {
      fire.on('body:raw', (raw) => {
        assert.ok(raw)
        resolve()
      })
      fire.handleBody(mockBodies)
    })
  }))
})

/* global describe, before, after, it */
