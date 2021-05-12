
/**
 * @author Excepts
 * @since 2021/05/12.
 */

/** Module import as order: system, third-party, local */
import http from 'http'
import KOA from 'koa'
// @ts-ignore
import log4js from 'koa-log4'
// @ts-ignore
import convert from 'koa-convert'
import body from 'koa-bodyparser'
import json from 'koa-json'
// @ts-ignore
import cors from 'koa2-cors'

import context from './context/context'
import indexRouter from './route/index'
import moduleRouter from './route/module'
// eslint-disable-next-line no-undef
import ErrnoException = NodeJS.ErrnoException;

const origins = context.config.server.response.headers.origins

const app = new KOA()

const _use = app.use

const logger = log4js.getLogger('typescript-koa')

app.use = (x) => _use.call(app, convert(x))
// middlewares
app.use(log4js.koaLogger(log4js.getLogger('http'), { level: 'auto' }))
app.use(body())
app.use(json())

// request perform log
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date().getTime() - start.getTime()
  logger.info(`- Perform Log: ${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(cors({
  origin: function (ctx: KOA.Context) {
    const index = origins.indexOf(ctx.request.headers.origin as string)
    if (index !== -1) {
      return origins[index]
    }
  }
}))

// response router
app.use(indexRouter.routes()).use(indexRouter.allowedMethods())
app.use(moduleRouter.routes()).use(moduleRouter.allowedMethods())
// 404
app.use(async (ctx: KOA.Context) => {
  ctx.status = 404
  logger.warn('cannot find resource %s', ctx.request.originalUrl)
})

// error logger
app.on('error', async (err: Error, ctx: KOA.Context) => {
  logger.error('error occurred:', err)
})

// context.listen(process.env.PORT || 5000);
const port = parseInt(context.config.port || process.env.PORT as string || '5000')

const server = http.createServer(app.callback())

server.listen(port)

server.on('error', (err: ErrnoException) => {
  if (err.syscall !== 'listen') {
    throw err
  }
  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      logger.error(port + ' requires elevated privileges')
      process.exit(1)
      // eslint-disable-next-line no-unreachable
      break
    case 'EADDRINUSE':
      logger.error(port + ' is already in use')
      process.exit(1)
      // eslint-disable-next-line no-unreachable
      break
    default:
      throw err
  }
})

server.on('listening', () => {
  logger.info('Listening on port: %d', port)
})

export default app
