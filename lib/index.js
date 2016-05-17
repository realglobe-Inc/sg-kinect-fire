/**
 * Fire event from kinect
 * @module sg-kinect-fire
 */

'use strict'

let d = (module) => module.default || module

module.exports = {
  get asSocket () { return d(require('./as_socket')) },
  get kinectFire () { return d(require('./kinect_fire')) }
}
