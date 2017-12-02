import { Context } from 'koa'
import typeRoutes from './type'

module Route {
  export const type = typeRoutes

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
}

export = Route
