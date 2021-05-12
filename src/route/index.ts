
'use strict'

/**
 * @author Excepts
 * @since 2021/05/12.
 */
import koa from 'koa'
// @ts-ignore
import Router from 'koa-router'

const router = new Router()

router.all('/', async (ctx: koa.Context) => {
  ctx.body = { index: '' }
})

export default router
