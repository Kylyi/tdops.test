import * as path from 'node:path'
import { generateApi } from 'swagger-typescript-api'
// import { config } from '../config'

export async function generateSwaggerTypes() {
//   const url = `${config.api.root}/swagger/v1/swagger.json`
  const url = 'http://tdops-dev.knowit.rs:2282/swagger/v1/swagger.json'

  await generateApi({
    // General
    url,
    fileNames: {
      dataContracts: 'data-contracts.type.ts',
      httpClient: 'http-client.ts',
      outOfModuleApi: 'api.ts',
      routeTypes: 'route-types.type.ts',
    },
    output: path.resolve(
      process.cwd(),
      './client/libs/Api/types/generated',
    ),

    // Options
    defaultResponseAsSuccess: true,
    extractRequestParams: true,
    sortTypes: true,
    modular: true,
    cleanOutput: true,

    // HTTP client
    generateClient: false,
    singleHttpClient: false,
  })
}
