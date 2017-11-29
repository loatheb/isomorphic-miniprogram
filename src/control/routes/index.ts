import { Context } from 'koa'

module Route {
  export class Index {
    public async index(ctx: Context, next: Function) {
      ctx.body = 'Hello world'
      ctx.type = 'text/html'
    }
  }
  export class HeartBeat {
    public async index(ctx: Context | any) {
      await ctx.render('index.pug', {
        content: 'HeartBeat',
      })
    }
  }
}

export = Route
