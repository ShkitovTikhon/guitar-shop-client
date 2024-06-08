import { IGuitarParts } from '@/types/guitarparts'
import { IFilterCheckboxItem } from '@/types/catalog'
import { guitarManufacturers, partsManufacturers } from '@/utils/catalog'
import { createDomain } from 'effector-next'

const guitarParts = createDomain()

export const setGuitarParts = guitarParts.createEvent<IGuitarParts>()
export const setGuitarPartsCheapFirst = guitarParts.createEvent()
export const setGuitarPartsExpensiveFirst = guitarParts.createEvent()
export const setGuitarPartsByPopularity = guitarParts.createEvent()
export const setFilteredGuitarParts = guitarParts.createEvent()
export const setGuitarManufacturers =
  guitarParts.createEvent<IFilterCheckboxItem[]>()
export const updateGuitarManufacturer =
  guitarParts.createEvent<IFilterCheckboxItem>()
export const setPartsManufacturers =
  guitarParts.createEvent<IFilterCheckboxItem[]>()
export const updatePartsManufacturer =
  guitarParts.createEvent<IFilterCheckboxItem>()
export const setGuitarManufacturersFromQuery =
  guitarParts.createEvent<string[]>()
export const setPartsManufacturersFromQuery =
  guitarParts.createEvent<string[]>()

const updateManufacturer = (
  manufacturers: IFilterCheckboxItem[],
  id: string,
  payload: Partial<IFilterCheckboxItem>
) =>
  manufacturers.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })

const updateManufacturerFromQuery = (
  manufacturers: IFilterCheckboxItem[],
  manufacturersFromQuery: string[]
) =>
  manufacturers.map((item) => {
    if (manufacturersFromQuery.find((title) => title === item.title)) {
      return {
        ...item,
        checked: true,
      }
    }

    return item
  })

export const $guitarParts = guitarParts
  .createStore<IGuitarParts>({} as IGuitarParts)
  .on(setGuitarParts, (_, parts) => parts)
  .on(setGuitarPartsCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
  }))
  .on(setGuitarPartsExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
  }))
  .on(setGuitarPartsByPopularity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.popularity - a.popularity),
  }))

export const $guitarManufacturers = guitarParts
  .createStore<IFilterCheckboxItem[]>(
    guitarManufacturers as IFilterCheckboxItem[]
  )
  .on(setGuitarManufacturers, (_, parts) => parts)
  .on(updateGuitarManufacturer, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setGuitarManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $partsManufacturers = guitarParts
  .createStore<IFilterCheckboxItem[]>(
    partsManufacturers as IFilterCheckboxItem[]
  )
  .on(setPartsManufacturers, (_, parts) => parts)
  .on(updatePartsManufacturer, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])
  .on(setPartsManufacturersFromQuery, (state, manufacturersFromQuery) => [
    ...updateManufacturerFromQuery(state, manufacturersFromQuery),
  ])

export const $filteredGuitarParts = guitarParts
  .createStore<IGuitarParts>({} as IGuitarParts)
  .on(setFilteredGuitarParts, (_, parts) => parts)
