import router from 'koa-router'
import { loadConfig, loadTemplate, loadStaticFile, loadPages, getIp } from './utils'

const app = router()

process.chdir('build')

function escape(x) {return x}

app.get('/:appType', async ctx => {
  const { appType } = ctx.params
  const [config, render] = await Promise.all([loadConfig('index', appType), loadTemplate('index', appType)])
  const pageConfig = await loadPages(config.pages)
  config['window'].pages = pageConfig
  const { tabBar } = config
  ctx.body = render({
    config: JSON.stringify(config),
    root: config.root,
    ip: getIp(),
    topBar: tabBar && tabBar.position == 'top',
  }, {}, escape)
  ctx.type = 'text/html'
})

app.get('/:appType/appservice', async ctx => {
  const { appType } = ctx.params
  const [config, render] = await Promise.all([loadConfig('appservice', appType), loadTemplate('appservice', appType)])
  ctx.body = render(config)
  ctx.type = 'text/html'
})

app.get('/:appType/service.js', async ctx => {
  const { appType } = ctx.params
  ctx.body = await loadStaticFile(appType)
  ctx.type = 'application/javascript'
})

app.get('/:appType/app/(.*)', async ctx => {
  const { appType } = ctx.params
  const { path } = ctx.params
  const filename = path.replace(/^\/(.*)\/app\//, '')
  switch(filename) {
  case /\.wxss$/.test(filename): {
    const content = await loadStaticFile(filename)
    ctx.body = util.parseCss(content, this.query.w, this.query.r)
    ctx.type ='application/css'
    break
  }
  case /\.js$/.test(filename): {
    let content = await loadStaticFile(filename)
    ctx.body = content
    ctx.type = 'application/javascript'
    break
  }
  }
})

export default app