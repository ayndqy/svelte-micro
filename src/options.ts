import { type Readable, writable } from 'svelte/store'

export interface OptionsList {
  mode: 'window' | 'hash'
  basePath: null | string
}

export interface Options {
  subscribe: Readable<OptionsList>['subscribe']
  set: (changedOptions: Partial<OptionsList>) => void
}

const createOptions = (initialValues: OptionsList): Options => {
  const { subscribe, update } = writable<OptionsList>(initialValues)

  const set: Options['set'] = (changedOptions = {}) => {
    update((options) => Object.assign(options, changedOptions))
  }

  return { subscribe, set }
}

export const options = createOptions({
  mode: 'window',
  basePath: null,
})
