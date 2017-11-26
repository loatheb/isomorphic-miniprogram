const ni = require('os').networkInterfaces()

const getIp = function() {
  let ipAddress = []
  for (let key in ni) {
    for (let index in ni[key]) {
      if (ni[key][index].family === 'IPv4' && !ni[key][index].internal) {
        ipAddress.push(ni[key][index].address)
      }
    }
  }
  if (ipAddress.length >= 1) {
    return ipAddress[0]
  } else {
    return '127.0.0.1'
  }
}

module.exports = {
  getIp,
  loadConfig: require('./loadConfig'),
  loadTemplate: require('./loadTemplate'),
  loadStaticFile: require('./loadStaticFile'),
  loadPages: require('./loadPages'),
}