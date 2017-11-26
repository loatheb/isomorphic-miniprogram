const fs = require('fs')
const parallel = require('node-parallel')
const merge = require('merge')

const DEFAULT_CONFIG = {
  'debug': false,
  'window':{
    'backgroundTextStyle':'light',
    'navigationBarBackgroundColor': '#fff',
    'navigationBarTitleText': 'WeChat',
    'navigationBarTextStyle':'black'
  },
  'projectConfig': {
    'Network': {
      'RequestDomain': [],
      'WsRequestDomain': [],
      'UploadDomain': [],
      'DownloadDomain': []
    },
    'Setting': {
      'MaxLocalstorageSize': 10,
      'MaxCodeSize': 5,
      'MaxWebviewDepth': 5,
      'MaxBackgroundLifespan': 300,
      'MaxRequestConcurrent': 5,
      'MaxUploadConcurrent': 1,
      'MaxDownloadConcurrent': 5
    }
  },
  'appserviceConfig': {
    'AppserviceMaxDataSize': 1048576,
    'HTTPSetting': {
      'HTTPHeaderMode': 'BlackList',
      'HeaderBlackList': [
        'User-Agent'
      ],
      'HeaderWhiteList': [],
      'UploadMaxTimeoutMS': 60000,
      'DownloadMaxTimeoutMS': 60000,
      'WebsocketMaxTimeoutMS': 60000,
      'RequestMaxTimeoutMS': 60000,
      'HTTPHeaderReferer': 'servicewechat.com'
    },
    'CDNBaseURL': 'https://res.wx.qq.com/weapp',
    'AppMaxRunningCount': 5
  },
  'apphash': 70475629,
  'userInfo': {
    'headUrl': 'https://s-media-cache-ak0.pinimg.com/136x136/7f/f7/b9/7ff7b921190bc4c05a1f3c11ff2ce086.jpg',
    'city': 'Chaoyang',
    'gender': 1,
    'nickName': '测试帐号',
    'province' : 'Beijing'
  }
}

function generateParallelJob(filename, cb) {
  return function(done) {
    return fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return done(null, {})
      try {
        return done(null, cb(data))
      } catch(e) {
        return done(e)
      }
    })
  }
}

function readAppJSONCb(result) {
  const config = JSON.parse(result)
  if (!config.pages || !config.pages.length) throw new Error('No pages found')

  const defaultRoot = config.pages[0]
  const { root = defaultRoot } = config
  return merge(config, { root })
}

function readWeptJSONCb(result) {
  return JSON.parse(result)
}

module.exports = function(page, type) {
  const readAppJSON = generateParallelJob(`./${type}/build/app.json`, readAppJSONCb)
  const readWeptJSON = generateParallelJob(`./${type}/build/wept.json`, readWeptJSONCb)
  return new Promise((resolve, reject) => {
    parallel()
      .add(readAppJSON)
      .add(readWeptJSON)
      .done((err, results) => {
        if (err) reject(err)
        const [app, wept] = results
        const mixedConfig = merge.recursive(true, {}, DEFAULT_CONFIG, app, wept, { directory: process.cwd(), appname: type })
        const { appid = 'touristappid' } = mixedConfig
        const result = merge.recursive(true, {}, mixedConfig, {
          appid,
          isTourist: mixedConfig.appid === 'touristappid',
          projectConfig: {
            appid,
          },
        })
        return resolve(result)
      })
  })
}