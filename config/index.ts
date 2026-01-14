// Config
import development from './development.json'
import staging from './staging.json'
import production from './production.json'
import local from './local.json'
import atest from './atest.json'
import docs from './documentation.json'

const CONFIG_MAP = {
  development,
  staging,
  production,
  local,
  atest,
}

export const environment: keyof typeof CONFIG_MAP = import.meta.env.VITE_ENV || 'local'
export const config = CONFIG_MAP[environment]
export const documentation = docs
