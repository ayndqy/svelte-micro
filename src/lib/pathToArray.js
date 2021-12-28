const pathToArray = (path) => {
  return path
    .split('/')
    .filter((path) => path !== '')
    .map((path) => '/' + path)
}

export default pathToArray
