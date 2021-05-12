/**
 * The application empty context, only serialize config.json into class/object.
 *
 * Since we cannot initialize services in the same js file,
 * it's required to import context.ts in order to use context's services.
 *
 *   *Reason: e.g. if Service A would depend on the config in context, A should
 *   import context, then context cannot import A to make a circle dependencies.
 *
 * @author Excepts
 * @since 2021/05/07.
 */

import path from 'path'
// @ts-ignore
import log4js from 'koa-log4'

import { Config } from '../types/config'
import config from '../../config/config.json'

log4js.configure(config.log4js, { cwd: config.log4js.cwd })

// eslint-disable-next-line no-undef
const refactorConfig = (cfg: Config) => {
  // eslint-disable-next-line no-undef
  const resultConfig: Config = cfg
  if (!cfg.path.root) {
    resultConfig.path.root = path.join(__dirname, '../../..')
  }

  if (process.platform === 'win32') {
    if (resultConfig.path.client.indexOf(':\\') !== 1) {
      resultConfig.path.client = path.join(resultConfig.path.root, resultConfig.path.client)
    }
    if (resultConfig.path.server.indexOf(':\\') !== 1) {
      resultConfig.path.server = path.join(resultConfig.path.root, resultConfig.path.server)
    }
    if (resultConfig.path.resources.indexOf(':\\') !== 1) {
      resultConfig.path.resources = path.join(resultConfig.path.root, resultConfig.path.resources)
    }
  } else {
    if (resultConfig.path.client.indexOf('/') !== 0) {
      resultConfig.path.client = path.join(resultConfig.path.root, resultConfig.path.client)
    }
    if (resultConfig.path.server.indexOf('/') !== 0) {
      resultConfig.path.server = path.join(resultConfig.path.root, resultConfig.path.server)
    }
    if (resultConfig.path.resources.indexOf('/') !== 0) {
      resultConfig.path.resources = path.join(resultConfig.path.root, resultConfig.path.resources)
    }
  }
  resultConfig.path.views = path.join(resultConfig.path.resources, 'views')
  return resultConfig
}

class Context {
  // eslint-disable-next-line no-undef
  config: Config
  container: Map<string, object> = new Map();

  // eslint-disable-next-line no-undef
  constructor (cfg: Config) {
    this.config = refactorConfig(cfg)
    // eslint-disable-next-line no-template-curly-in-string,node/no-path-concat
    cfg.path.root = cfg.path.root.replace('${pwd}', __dirname + '/..')
  }

  register (name: string, module: object) {
    this.container.set(name, module)
  }

  module (name: string) {
    return this.container.get(name)
  }
}

// eslint-disable-next-line no-undef
export default new Context(Object.assign(new Config(), config))
