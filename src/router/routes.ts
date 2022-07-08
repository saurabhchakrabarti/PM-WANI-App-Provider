export const appRoutesPrefix = '/api'

export const authRoutePrefix = '/auth'
export const userRoutePrefix = '/user'
export const centralRegistryRoutePrefix = '/centralregistry'
export const tokenRoutePrefix = '/tokenize'
export const sessionRoutePrefix = '/logs'


export enum centralRegistryRoutes {
  DownloadWaniProviders = '/getwaniproviders', // GET
  DownloadWaniAPList = '/getaplist', // GET
}

export enum tokenRoutes {
  VerifyWaniPdoa = '/verifywanipdoatoken'
}

export enum userRoutes {
  CreateUser = '/'
}