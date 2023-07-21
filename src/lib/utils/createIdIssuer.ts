export type CreateIdIssuer = () => () => number

export const createIdIssuer: CreateIdIssuer = () => {
  let id = 0
  return () => id++
}
