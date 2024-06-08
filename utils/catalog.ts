import { NextRouter } from 'next/router'
import { getQueryParamOnFirstRender, idGenerator } from './common'
import { getGuitarPartsFx } from '@/app/api/guitarParts'
import { setFilteredGuitarParts } from '@/context/guitarParts'

const createManufacturerCheckboxObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})

export const guitarManufacturers = [
  'Cort',
  'Ibanez',
  'Yamaha',
  'Gibson',
  'Fligth',
  'Fender',
  'Belluchi',
  'Martinez',
  'Homage',
  'Fabio',
  'Epiphone',
  'Hohner',
  'Boss',
  'VOX',
  'Marshall',
  'Orange',
  'Silvertone',
  'Roland',
  'DiMarzio',
  'Seymour Duncan',
  'Aguilar',
].map(createManufacturerCheckboxObj)

export const partsManufacturers = [
  "Микрофоны",
  "Электрогитары",
  "Бас-гитары",
  "Акустические гитары",
  "Барабанные установки",
  "Клавишные",
  "Микшерные пульты",
  "Аудио интерфейсы",
  "Звукосниматели",
  "Педали",
  "Аксессуары",
  "Струны",
  "Усилители для гитар",
].map(createManufacturerCheckboxObj)

const musicInstrumentImages = [
  'https://example.com/guitar.jpg',
  'https://example.com/bass.jpg',
  'https://example.com/drums.jpg',
  'https://example.com/piano.jpg',
  'https://example.com/violin.jpg',
];


const checkPriceFromQuery = (price: number) =>
  price && !isNaN(price) && price >= 0 && price <= 10000

export const checkQueryParams = (router: NextRouter) => {
  const priceFromQueryValue = getQueryParamOnFirstRender(
    'priceFrom',
    router
  ) as string
  const priceToQueryValue = getQueryParamOnFirstRender(
    'priceTo',
    router
  ) as string
  const guitarQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('guitar', router) as string)
  )
  const partsQueryValue = JSON.parse(
    decodeURIComponent(getQueryParamOnFirstRender('parts', router) as string)
  )
  const isValidGuitarQuery =
    Array.isArray(guitarQueryValue) && !!guitarQueryValue?.length
  const isValidPartsQuery =
    Array.isArray(partsQueryValue) && !!partsQueryValue?.length
  const isValidPriceQuery =
    checkPriceFromQuery(+priceFromQueryValue) &&
    checkPriceFromQuery(+priceToQueryValue)

  return {
    isValidGuitarQuery,
    isValidPartsQuery,
    isValidPriceQuery,
    priceFromQueryValue,
    priceToQueryValue,
    guitarQueryValue,
    partsQueryValue,
  }
}

export const updateParamsAndFiltersFromQuery = async (
  callback: VoidFunction,
  path: string
) => {
  callback()

  const data = await getGuitarPartsFx(`/guitar-parts?limit=20&offset=${path}`)

  setFilteredGuitarParts(data)
}

export async function updateParamsAndFilters<T>(
  updatedParams: T,
  path: string,
  router: NextRouter
) {
  const params = router.query

  delete params.guitar
  delete params.parts
  delete params.priceFrom
  delete params.priceTo

  router.push(
    {
      query: {
        ...params,
        ...updatedParams,
      },
    },
    undefined,
    { shallow: true }
  )

  const data = await getGuitarPartsFx(`/guitar-parts?limit=20&offset=${path}`)

  setFilteredGuitarParts(data)
}
