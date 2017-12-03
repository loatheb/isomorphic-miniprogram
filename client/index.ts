/* tslint:disable */
declare var __wxConfig__: any

import { createFrame } from './utils'
import * as nativeMethods from './native'
import './event'
import './listener'

const appname = __wxConfig__.appname
const serviceFrame = createFrame('service', `/${appname}/appservice`, true)
Object.defineProperty(serviceFrame.contentWindow, 'prompt', {
  get () {
    return function (str) {
      if (str.indexOf('____sdk____') !== 0) {
        return console.warn(`Invalid prompt ${str}`)
      }
      const obj = JSON.parse(str.replace(/^____sdk____/, ''))
      const method = obj.sdkName
      if (nativeMethods.hasOwnProperty(method)) {
        return JSON.stringify(nativeMethods[method](obj))
      }
      console.warn(`${method} not found on native.js`)
    }
  },
})
