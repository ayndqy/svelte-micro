export const pathToArray = (path) => {
  let pathArray = path.split('/').filter((path) => path !== '');

  for (let i = 0; i < pathArray.length; i++) {
    pathArray[i] = '/' + pathArray[i];
  }

  return pathArray;
};
