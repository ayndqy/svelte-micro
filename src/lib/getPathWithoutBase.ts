export type GetPathWithoutBase = (path: string, basePath: string | null) => string

export const getPathWithoutBase: GetPathWithoutBase = (path, basePath) => {
  if (basePath === null) return path

  return path.startsWith(basePath) ? path.slice(basePath.length) : path
}
