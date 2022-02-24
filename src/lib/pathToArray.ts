export type PathToArray = (path: string) => string[]

const pathToArray: PathToArray = (path) => {
  return path
    .split('/')
    .filter((path) => path !== '')
    .map((path) => '/' + path)
}

export default pathToArray
