import * as koa from 'koa'
import * as logger from 'koa-logger'
import * as serve from 'koa-static'
import * as getPort from 'get-port'
import * as router from './router'
import { notifyError } from './middleware'
import { dummy } from './utils'
import { DEFAULT_PORT } from './config'

const app = new koa()
app.use(logger())
app.use(serve(`${__dirname}/public`))
app.use(router.routes())
app.use(router.allowedMethods())

export const createServer = (defaultPort: number = DEFAULT_PORT, cb: Function = dummy): Function => {
  let port: number = defaultPort
  let times: number = 0

  return async () => {
    const validPort = await getPort({ port })
    port = validPort
    times += 1
    app.listen(port, cb(port, times))
  }
}

export default createServer(3000, function (port) {
  console.log(port)
})
