export type GetPathSegments = (path: string) => string[]

export const getPathSegments: GetPathSegments = (path) => {
  return path.split(/(?=\/)/)
}
