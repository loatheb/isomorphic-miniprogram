const fs = require('fs')
const path = require('path')
const et = require('et-improve')

module.exports = function (name) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.resolve(__dirname, `../template/${name}.html`), 'utf8', (err, content) => {
      if (err) return reject(err)
      try {
        resolve(et.compile(content))
      } catch (e) {
        reject(e.stack)
      }
    })
  })
}
