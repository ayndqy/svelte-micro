import { type Writable, writable } from 'svelte/store'
import type { Route } from './route'

export type ChildRoutesStore = {
  subscribe: Writable<Route[]>['subscribe']
  updateRoute: (id: Route['id'], route: Route | null) => void
}

export const createChildRoutes = (): ChildRoutesStore => {
  const { subscribe, update } = writable<Route[]>([])

  return {
    subscribe: subscribe,

    updateRoute: (id, route) => {
      update((childRoutes) => {
        const filteredChildRoutes = childRoutes.filter((child) => id !== child?.id)
        return route === null ? [...filteredChildRoutes] : [...filteredChildRoutes, route]
      })
    },
  }
}
