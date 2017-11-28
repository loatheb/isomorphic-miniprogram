const ni = require('os').networkInterfaces()

const getIp = function () {
  const ipAddress = []
  for (const key in ni) {
    for (const index in ni[key]) {
      if (ni[key][index].family === 'IPv4' && !ni[key][index].internal) {
        ipAddress.push(ni[key][index].address)
      }
    }
  }
  if (ipAddress.length >= 1) {
    return ipAddress[0]
  }
  return '127.0.0.1'
}

export const dummy = function dummy() {}

export default {
  dummy,
  getIp,
  loadConfig: require('./loadConfig'),
  loadTemplate: require('./loadTemplate'),
  loadStaticFile: require('./loadStaticFile'),
  loadPages: require('./loadPages'),
}
