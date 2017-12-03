import { Context } from 'koa'
import { loadConfigByType, loadJSONfiles, globJSfiles, groupFiles, parseJavascript, concatFiles } from '../../modal'

export default class Type {
  public async index(ctx: Context | any, next?: Function) {
    const { type } = ctx.params
    const config: any = await loadConfigByType(type)
    const pagesResultList: any = await Promise.all(config.pages.map(page => loadJSONfiles(`${type}/${page}`)))
    const pagesMap = {}
    config.pages.forEach((page, index) => {
      pagesMap[page] = JSON.parse(pagesResultList[index])
    })
    config['window'].pages = pagesMap
    ctx.render('index', {
      config,
    })
  }

  public async commonService(ctx: Context | any) {
    const { type } = ctx.params
    const config: any = await loadConfigByType(type)
    ctx.render('service', {
      config,
      appname: type,
    })
  }

  public async service(ctx: Context | any) {
    const { type } = ctx.params
    const config: any = await loadConfigByType(type)
    const files = await globJSfiles(type)
    const [utils, routes] = groupFiles(files, config, type)

    const paths = utils.concat(`${type}/app.js`, routes)
    const result = await Promise.all(paths.map(path => parseJavascript(config, path)))
    const obj = paths.map((path, i) => {
      return { path, code: result[i] }
    })
    const { pages } = config
    const { headers } = ctx.request
    ctx.body = concatFiles(obj, pages)
    ctx.set('Content-Type', 'application/javascript; charset=utf-8')
  }
}
