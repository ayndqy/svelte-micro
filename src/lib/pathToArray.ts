export type PathToArray = (path: string) => string[]

export const pathToArray: PathToArray = (path) => {
  return path
    .split('/')
    .filter((path) => path !== '')
    .map((path) => '/' + path)
}
