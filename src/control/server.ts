import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as serve from 'koa-static'
import * as Router from 'koa-router'
import * as Pug from 'koa-pug'
import * as routes from './routes'
import * as path from 'path'

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
      noCache: true,
    })
    pug.use(this.app)
  }

  private routes(): void {
    const router: Router = new Router()

    const index: routes.Index = new routes.Index()
    const heartbeat: routes.HeartBeat = new routes.HeartBeat()
    const type = new routes.type()

    router.get('/favicon', dummy)
    router.get('/', index.index.bind(index.index))
    router.get('/heartbeat', heartbeat.index.bind(heartbeat.index))
    router.get('/:type', type.index.bind(type.index))
    router.get('/:type/appservice', type.commonService.bind(type.commonService))
    router.get('/:type/service.js', type.service.bind(type.service))

    this.app.use(router.routes())
    this.app.use(router.allowedMethods())
    this.app.use(serve(path.resolve(__dirname, '../../public')))
  }
}
