'use strict'

function mockKinect2 () {
  let handlers = {}
  return {
    open () {
      return true
    },
    close () {

    },
    on (ev, handler) {
      handlers[ ev ] = handler
    },
    openBodyReader () {
      setInterval(() => {
        let bodyFrameHandler = handlers[ 'bodyFrame' ]
        if (bodyFrameHandler) {
          bodyFrameHandler({
            bodies: require('./mock-bodies')
          })
        }
      }, 100).unref()
    }
  }
}

module.exports = mockKinect2