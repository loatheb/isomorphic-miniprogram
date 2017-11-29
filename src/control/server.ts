import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as serve from 'koa-static'
import * as Router from 'koa-router'
import * as Pug from 'koa-pug'
import * as routes from './routes'

function dummy() {}

export class Server {
  private app: Koa
  private port: number
  private counts: number

  constructor(port: number) {
    this.app = new Koa()
    this.port = port
    this.counts = 0
  }

  public start(successCb: Function = dummy, errorCb: Function = dummy): void {
    this.counts += 1
    this.app.listen(this.port, successCb(this.port, this.counts))
    this.app.on('error', e => errorCb(e, this.port, this.counts))

    this.config()
    this.routes()
  }

  private config(): void {
    const pug = new Pug({
      viewPath: 'src/view',
    })
    pug.use(this.app)
  }

  private routes(): void {
    const router: Router = new Router()

    const index: routes.Index = new routes.Index()
    const heartbeat: routes.HeartBeat = new routes.HeartBeat()

    router.get('/', index.index.bind(index.index))
    router.get('/heartbeat', heartbeat.index.bind(heartbeat.index))

    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
  }
}
