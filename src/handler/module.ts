import BaseHandler from './base'
import Module from '../types/module'

export default class ModuleHandler extends BaseHandler {
  // eslint-disable-next-line no-useless-constructor
  constructor (envoy: any) {
    super(envoy)
  }

  async query (code: string): Promise<Module> {
    return { code } as Module
  }

  async modify (module: Module) {
    console.info(module.code)
    return { code: '' }
  }
}
