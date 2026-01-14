import { customDefu } from '#layers/utilities/shared/functions/custom-defu'
import config0 from '/home/jk/Projects/testing/utilities-config'
import config1 from '/home/jk/Projects/testing/node_modules/.c12/github_gentlsro_Utilities_aSrOKteH32/config'

export const utilsConfig = customDefu(config0, config1)

export type IIUtilitiesConfig = typeof utilsConfig
export default utilsConfig
