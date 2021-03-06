'use strict'

const { KinectFire } = require('sg-kinect-fire')
const { jointTypes } = require('sg-kinect-constants')

let { HEAD, HAND_LEFT, SPINE_BASE } = jointTypes

let fire = new KinectFire({
  bodyReducers: {
    leftHandHigherThanHead: (frame) => (frame.joints[ HAND_LEFT ].cameraY > frame.joints[ HEAD ].cameraY),
    spineBaseLowerThanHead: (frame) => (frame.joints[ SPINE_BASE ].cameraY < frame.joints[ HEAD ].cameraY)
  }
})

// Handle kinect reduced frame data
fire.on('body:detect', (detected) => {
  console.log(detected)
})

// Handle kinect raw frame data
fire.on('body:raw', (frame) => {
  console.log(frame)
})

