import { Context, Middleware } from 'koa'

module Route {
  export class Index {
    public async index(ctx: Context, next: Function) {
      ctx.body = 'Hello world'
      ctx.type = 'text/html'
    }
  }
  export class HeartBeat {
    public async index(ctx: Context) {
      ctx.body = 'heartbeat'
      ctx.type = 'text/html'
    }
  }
}

export = Route
