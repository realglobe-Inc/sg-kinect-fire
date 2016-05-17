/**
 * Get kinect2 instance
 * @function kinect2
 */
'use strict'

function kinect2 () {
  try {
    let Kinect2 = require('kinect2')
    return new Kinect2()
  } catch (e) {
    return new Error('Failed to initialize kinect')
  }
}

module.exports = kinect2
