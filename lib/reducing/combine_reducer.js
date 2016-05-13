/**
 * Combine multiple reducers into one.
 * @function combineReducer
 * @param {Object} reducers
 * @returns {function}
 */
'use strict'

/** @lends combineReducer */
function combineReducer (reducers) {
  let type = typeof reducers
  switch (type) {
    case 'function':
      return reducers
    case 'object':
      return function combinedReducer (...args) {
        let reduced = {}
        for (let name of Object.keys(reducers)) {
          let reducer = reducers[ name ]
          reduced[ name ] = reducer(...args)
        }
        return reduced
      }
    default:
      throw new Error(`Invalid reducer type: ${type}`)
  }
}

module.exports = combineReducer
