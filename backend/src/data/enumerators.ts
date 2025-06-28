export enum ResponseStatus {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  EXPIRED = 410,
}

export enum ResponseMessage {
  VALIDATION_ERROR = 'UNPROCESSABLE_ENTITY',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  PRODUCTION = 'PRODUCTION',
  STAGING = 'STAGING',
}

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

export enum TokenName {
  INVOICE = 'Invoice',
}

export enum TokenSymbol {
  INV = 'INV',
}
