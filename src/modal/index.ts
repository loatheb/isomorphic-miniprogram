import * as fs from 'mz/fs'
import { normalize } from 'path'
import * as merge from 'merge'
import * as glob from 'glob'
import * as parallel from 'node-parallel'
import * as Concat from 'concat-with-sourcemaps'
import * as babel from 'babel-core'

const DEFAULT_CONFIG = {
  debug: false,
  window:{
    backgroundTextStyle:'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle:'black',
  },
  projectConfig: {
    Network: {
      RequestDomain: [],
      WsRequestDomain: [],
      UploadDomain: [],
      DownloadDomain: [],
    },
    Setting: {
      MaxLocalstorageSize: 10,
      MaxCodeSize: 5,
      MaxWebviewDepth: 5,
      MaxBackgroundLifespan: 300,
      MaxRequestConcurrent: 5,
      MaxUploadConcurrent: 1,
      MaxDownloadConcurrent: 5,
    },
  },
  appserviceConfig: {
    AppserviceMaxDataSize: 1048576,
    HTTPSetting: {
      HTTPHeaderMode: 'BlackList',
      HeaderBlackList: [
        'User-Agent',
      ],
      HeaderWhiteList: [],
      UploadMaxTimeoutMS: 60000,
      DownloadMaxTimeoutMS: 60000,
      WebsocketMaxTimeoutMS: 60000,
      RequestMaxTimeoutMS: 60000,
      HTTPHeaderReferer: 'servicewechat.com',
    },
    CDNBaseURL: 'https://res.wx.qq.com/weapp',
    AppMaxRunningCount: 5,
  },
  apphash: 70475629,
  userInfo: {
    headUrl: 'https://s-media-cache-ak0.pinimg.com/136x136/7f/f7/b9/7ff7b921190bc4c05a1f3c11ff2ce086.jpg',
    city: 'Chaoyang',
    gender: 1,
    nickName: '测试帐号',
    province : 'Beijing',
  },
}

function generateParallelJob(filename, cb) {
  return function (done) {
    return fs.readFile(filename, 'utf8', (err, data) => {
      if (err) return done(null, {})
      try {
        return done(null, cb(data))
      } catch (e) {
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

export function loadConfigByType(type) {
  const readAppJSON = generateParallelJob(`./${type}/app.json`, readAppJSONCb)
  const readWeptJSON = generateParallelJob(`./${type}/wept.json`, readWeptJSONCb)
  return new Promise((resolve, reject) => {
    parallel()
      .add(readAppJSON)
      .add(readWeptJSON)
      .done((err, results) => {
        if (err) reject(err)
        const [app, wept] = results
        const mixedConfig = merge.recursive(true, {}, DEFAULT_CONFIG, app, wept, {
          directory: process.cwd(),
          appname: type,
        })
        const { appid = 'touristappid' } = mixedConfig
        const result = merge.recursive(true, {}, mixedConfig, {
          appid,
          isTourist: mixedConfig.appid === 'touristappid',
          projectConfig: {
            appid,
          },
        })
        console.log('loadConfigByType', result)
        return resolve(result)
      })
  })
}

export function loadJSONfiles(name) {
  return fs.readFile(`${name}.json`, 'utf-8')
}

export function globJSfiles(type) {
  return new Promise((resolve, reject) => {
    glob('**/*.js', {
      ignore: 'node_modules/**/*.js',
    },   (err, files) => {
      if (err) return reject(err)
      resolve(files.map(normalize))
    })
  })
}

export function groupFiles(files, config, type) {
  const pages = config.pages.map((page) => {
    return `${type}/${page}.js`
  })
  const utils = []
  const routes = []
  files.forEach((file) => {
    if (!pages.includes(file) && file !== 'app.js') {
      utils.push(file)
    }
  })

  pages.forEach((page) => {
    if (!files.includes(page)) {
      console.log(` ✗ ${page} not found`)
    } else {
      routes.push(page)
    }
  })
  return [utils, routes]
}

export function concatFiles(obj, pages) {
  const concat = new Concat(true, 'service.js', '\n')
  for (const item of obj) {

    const path = item.path
    const route = path.replace(/\.js$/, '')
    const isPage = pages.indexOf(route) !== -1
    if (!isPage) {
      concat.add(item.path, item.code, item.map)
    } else {
      concat.add(null, `var __wxRoute = "${route}", __wxRouteBegin = true;`)
      concat.add(item.path, item.code, item.map)
    }
  }
  console.log(' ✓ service.js build success')
  return `${concat.content}\n`
}

export function parseJavascript(config, fullPath) {
  return new Promise((resolve, reject) => {
    const isModule = fullPath !== 'app.js' && config.pages.indexOf(fullPath.replace(/\.js$/, '')) === -1
    loadJavascript(fullPath, config.babel, (err, result) => {
      if (err) return reject(err)
      const concat = new Concat(true, fullPath, '\n')
      concat.add(
        null,
        `define("${fullPath}", function(require, module, exports,
           window,document,frames,self,location,navigator,localStorage,
          history,Caches,screen,alert,confirm,prompt,fetch,
          XMLHttpRequest,WebSocket,webkit,WeixinJSCore,WeixinJSBridge,Reporter){`)
      concat.add(fullPath, result.code, result.map)
      concat.add(null, '});' + (isModule ? '' : `require("${fullPath}")`))
      return resolve(concat.content)
    })
  })
}

export function loadJavascript(fullPath, useBabel, cb) {
  if (useBabel) {
    babel.transformFile(fullPath, {
      presets: ['babel-preset-es2015'].map(require.resolve),
      sourceMaps: true,
      sourceFileName: fullPath,
      babelrc: false,
      ast: false,
      resolveModuleSource: false,
    },                  (err, result) => {
      if (err) return cb(err)
      cb(null, result)
    })
  } else {
    fs.readFile(fullPath, 'utf8', (err, content) => {
      if (err) return cb(err)
      cb(null, {
        code: content,
        map: null,
      })
    })
  }
}
