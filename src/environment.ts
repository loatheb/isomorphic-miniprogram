import * as Promise from 'bluebird'

const es6methods: string[] = ['then', 'catch', 'constructor']
const es6StaticMethods = ['all', 'race', 'resolve', 'reject', 'cast']

function isNotMethod(name) {
  return !(es6methods.includes(name) || es6StaticMethods.includes(name) || name.charAt(0) === '_')
}

function del(obj) {
  return (key) => { delete obj[key] }
}

function toFastProperties(obj) {
  (function () {}).prototype = obj
}

Object.keys(Promise.prototype).filter(isNotMethod).forEach(del(Promise.prototype))
Object.keys(Promise).filter(isNotMethod).forEach(del(Promise))
toFastProperties(Promise)
toFastProperties(Promise.prototype)

global.Promise = Promise
