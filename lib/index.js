/**
 * Fire event from kinect
 * @module sg-kinect-fire
 */

'use strict'

let d = (module) => module.default || module

module.exports = {
  get KinectFire () { return d(require('./kinect_fire')) },
  get KinectSocketFire () { return d(require('./kinect_socket_fire')) }
}
