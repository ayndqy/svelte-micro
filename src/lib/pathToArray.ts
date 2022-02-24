import type { PathToArray } from '../types/PathToArray'

const pathToArray: PathToArray = (path) => {
  return path
    .split('/')
    .filter((path) => path !== '')
    .map((path) => '/' + path)
}

export default pathToArray
