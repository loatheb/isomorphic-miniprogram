import { Context } from 'koa'
import { loadConfigByType, loadJSONfiles } from '../../modal'

module Route {
  export class Index {
    public async index(ctx: Context, next?: Function) {
      ctx.body = 'Hello world'
      ctx.type = 'text/html'
      if (next) await next
    }
  }

  export class HeartBeat {
    public async index(ctx: Context | any, next?: Function) {
      await ctx.render('index', {
        content: 'HeartBeat',
      })
      if (next) await next
    }
  }

  export class Type {
    public async index(ctx: Context | any, next?: Function) {
      const { type } = ctx.params
      const { path } = ctx.request
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
  }

}

export = Route
