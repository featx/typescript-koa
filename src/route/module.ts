
'use strict'

/**
 * @author Excepts
 * @since 2021/05/12.
 */
import koa from 'koa'
// @ts-ignore
import Router from 'koa-router'

import context from '../context/context'
import ModuleHandler from '../handler/module'

const moduleHandler = context.module('handler.module') as ModuleHandler

const router = new Router({ prefix: '/module' })

router.get('/', async (ctx: koa.Context) => {
  // @ts-ignore
  ctx.body = await moduleHandler.query(ctx.request.query.code)
})
router.post('/', async (ctx: koa.Context) => {
  ctx.body = await moduleHandler.modify(await ctx.request.body)
})
router.use(router.routes())

export default router
