import * as merge from 'merge'

function toResult(msg, data, command) {
  const obj: any = {
    msg,
    ext: data,
  }
  if (command) obj.command = command
  return obj
}

function toError(data, result = false, extra = {}) {
  const name = data.sdkName
  const obj = merge.recursive(true, {
    errMsg: `${name}:fail`,
  }, extra)
  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null)
}

function toSuccess(data, result = false, extra = {}) {
  const name = data.sdkName
  const obj = merge.recursive(true, {
    errMsg: `${name}:ok`,
  }, extra)
  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null)
}

function systemInfo() {
  return {
    model: /iPhone/.test(navigator.userAgent) ? 'iPhone6' : 'Android',
    pixelRatio: window.devicePixelRatio || 1,
    windowWidth: window.innerWidth || 0,
    windowHeight: window.innerHeight || 0,
    language: window.navigator.language,
    platform: 'wept',
    version: '6.3.9',
  }
}

export function getSystemInfoSync(data) {
  const info = systemInfo()
  return toSuccess(data, true, info)
}

export function getSystemInfo(data) {
  const info = systemInfo()
  return toSuccess(data, true, info)
}
