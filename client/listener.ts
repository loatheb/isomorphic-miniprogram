import * as Emitter from 'component-emitter'
export const event = new Emitter()

event.once('APP_SERVICE_COMPLETE', () => {
  console.log('APP_SERVICE_COMPLETE')
  window.postMessage({
    to: 'devtools',
    sdkName: 'APP_SERVICE_COMPLETE',
  }, '*')
})
