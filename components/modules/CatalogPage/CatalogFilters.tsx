import { useMediaQuery } from '@/hooks/useMediaQuery'
import CatalogFiltersDesktop from './CatalogFiltersDesktop'
import { ICatalogFiltersProps } from '@/types/catalog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  $guitarManufacturers,
  $partsManufacturers,
  setGuitarManufacturersFromQuery,
  setPartsManufacturersFromQuery,
} from '@/context/guitarParts'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { getQueryParamOnFirstRender } from '@/utils/common'
import CatalogFiltersMobile from './CatalogFiltersMobile'
import {
  checkQueryParams,
  updateParamsAndFilters,
  updateParamsAndFiltersFromQuery,
} from '@/utils/catalog'

const CatalogFilters = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  resetFilters,
  isPriceRangeChanged,
  currentPage,
  setIsFilterInQuery,
  closePopup,
  filtersMobileOpen,
}: ICatalogFiltersProps) => {
  const isMobile = useMediaQuery(820)
  const [spinner, setSpinner] = useState(false)
  const guitarManufacturers = useStore($guitarManufacturers)
  const partsManufacturers = useStore($partsManufacturers)
  const router = useRouter()

  useEffect(() => {
    applyFiltersFromQuery()
  }, [])

  const applyFiltersFromQuery = async () => {
    try {
      const {
        isValidGuitarQuery,
        isValidPartsQuery,
        isValidPriceQuery,
        partsQueryValue,
        priceFromQueryValue,
        guitarQueryValue,
        priceToQueryValue,
      } = checkQueryParams(router)

      const guitarQuery = `&guitar=${getQueryParamOnFirstRender(
        'guitar',
        router
      )}`
      const partsQuery = `&parts=${getQueryParamOnFirstRender('parts', router)}`
      const priceQuery = `&priceFrom=${priceFromQueryValue}&priceTo=${priceToQueryValue}`

      if (isValidGuitarQuery && isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setGuitarManufacturersFromQuery(guitarQueryValue)
          setPartsManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${priceQuery}${guitarQuery}${partsQuery}`)
        return
      }

      if (isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
        }, `${currentPage}${priceQuery}`)
      }

      if (isValidGuitarQuery && isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setGuitarManufacturersFromQuery(guitarQueryValue)
          setPartsManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${guitarQuery}${partsQuery}`)
        return
      }

      if (isValidGuitarQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setGuitarManufacturersFromQuery(guitarQueryValue)
        }, `${currentPage}${guitarQuery}`)
      }

      if (isValidPartsQuery) {
        updateParamsAndFiltersFromQuery(() => {
          setIsFilterInQuery(true)
          setPartsManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${partsQuery}`)
      }

      if (isValidPartsQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setPartsManufacturersFromQuery(partsQueryValue)
        }, `${currentPage}${priceQuery}${partsQuery}`)
      }

      if (isValidGuitarQuery && isValidPriceQuery) {
        updateParamsAndFiltersFromQuery(() => {
          updatePriceFromQuery(+priceFromQueryValue, +priceToQueryValue)
          setGuitarManufacturersFromQuery(guitarQueryValue)
        }, `${currentPage}${priceQuery}${guitarQuery}`)
      }
    } catch (error) {
      const err = error as Error

      if (err.message === 'URI malformed') {
        toast.warning('Неправильный url для фильтров')
        return
      }

      toast.error(err.message)
    }
  }

  const updatePriceFromQuery = (priceFrom: number, priceTo: number) => {
    setIsFilterInQuery(true)
    setPriceRange([+priceFrom, +priceTo])
    setIsPriceRangeChanged(true)
  }

  const applyFilters = async () => {
    setIsFilterInQuery(true)
    try {
      setSpinner(true)
      const priceFrom = Math.ceil(priceRange[0])
      const priceTo = Math.ceil(priceRange[1])
      const priceQuery = isPriceRangeChanged
        ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
        : ''
      const guitars = guitarManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)
      const parts = partsManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)
      const encodedGuitarQuery = encodeURIComponent(JSON.stringify(guitars))
      const encodedPartsQuery = encodeURIComponent(JSON.stringify(parts))
      const guitarQuery = `&guitar=${encodedGuitarQuery}`
      const partsQuery = `&parts=${encodedPartsQuery}`
      const initialPage = currentPage > 0 ? 0 : currentPage

      if (guitars.length && parts.length && isPriceRangeChanged) {
        updateParamsAndFilters(
          {
            guitar: encodedGuitarQuery,
            parts: encodedPartsQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}${guitarQuery}${partsQuery}`,
          router
        )
        return
      }

      if (isPriceRangeChanged) {
        updateParamsAndFilters(
          {
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}`,
          router
        )
      }

      if (guitars.length && parts.length) {
        updateParamsAndFilters(
          {
            guitar: encodedGuitarQuery,
            parts: encodedPartsQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${guitarQuery}${partsQuery}`,
          router
        )
        return
      }

      if (guitars.length) {
        updateParamsAndFilters(
          {
            guitar: encodedGuitarQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${guitarQuery}`,
          router
        )
      }

      if (parts.length) {
        updateParamsAndFilters(
          {
            parts: encodedPartsQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${partsQuery}`,
          router
        )
      }

      if (guitars.length && isPriceRangeChanged) {
        updateParamsAndFilters(
          {
            guitar: encodedGuitarQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${guitarQuery}${priceQuery}`,
          router
        )
      }

      if (parts.length && isPriceRangeChanged) {
        updateParamsAndFilters(
          {
            parts: encodedPartsQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${partsQuery}${priceQuery}`,
          router
        )
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  return (
    <>
      {isMobile ? (
        <CatalogFiltersMobile
          closePopup={closePopup}
          spinner={spinner}
          applyFilters={applyFilters}
          priceRange={priceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          setPriceRange={setPriceRange}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          resetFilters={resetFilters}
          filtersMobileOpen={filtersMobileOpen}
        />
      ) : (
        <CatalogFiltersDesktop
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          spinner={spinner}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      )}
    </>
  )
}

export default CatalogFilters
