'use strict'

const sgKinectFire = require('sg-kinect-fire')

let fire = sgKinectFire({
  pose: {}
})

fire.on('pose', (data) => {
  let {pose} = data
})

// Handle kinect raw frame data
fire.on('raw', (frame) => {
  console.log(frame)
})

