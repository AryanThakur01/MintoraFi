export interface IResponse<T, E = unknown> {
  message: string
  data: T
  extras?: E
}
