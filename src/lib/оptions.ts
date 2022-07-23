import { writable, type Readable } from 'svelte/store'

export interface OptionsList {
  linkHandle: boolean
}

export interface Options {
  subscribe: Readable<OptionsList>['subscribe']
  set: (changedOptions: Partial<OptionsList>) => void
}

type CreateOptions = (initialValues: OptionsList) => Options

const createOptions: CreateOptions = (initialValues) => {
  const { subscribe, update } = writable<OptionsList>(initialValues)

  return {
    subscribe,

    set: (changedOptions) => {
      update((options) => Object.assign(options, changedOptions))
    },
  }
}

export const options = createOptions({
  linkHandle: true,
})
