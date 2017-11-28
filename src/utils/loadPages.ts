import * as fs from 'fs'
const parallel = require('node-parallel')

module.exports = function (pages) {
  const work = parallel()
  const res = {}
  return function (resolve) {
    pages.forEach(page => {
      const file = `${page}.json`
      work.add(cb => {
        fs.stat(file, function (err, stat) {
          if (stat && stat.isFile()) {
            fs.readFile(file, 'utf8', (err, content) => {
              if (err) return cb()
              try {
                res[page] = JSON.parse(content)
              } catch (e) {
                return cb(new Error(`${file} JSON 解析失败，请检查`))
              }
              cb()
            })
          } else {
            return cb()
          }
        })
      })
    })
    pages.done((err, res) => {
      if (err) return resolve(err)
      resolve(null, res)
    })
  }
}
