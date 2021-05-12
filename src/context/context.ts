
'use strict'

/**
 * @author Excepts
 * @since 2021/05/12.
 */

// import log4js from 'koa-log4';

import context from './config'
import ModuleHandler from '../handler/module'

// const logger = log4js.getLogger('rosetta-client');
// TODO construct the envoy
const envoy = {}
context.register('module.envoy', envoy)
context.register('handler.network', new ModuleHandler(envoy))
export default context
