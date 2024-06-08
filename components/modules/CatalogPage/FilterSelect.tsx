/* eslint-disable indent */
import { useStore } from 'effector-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { $mode } from '@/context/mode'
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select'
import { optionStyles } from '@/styles/searchInput'
import { IOption, SelectOptionType } from '@/types/common'
import { createSelectOption } from '@/utils/common'
import { categoriesOptions } from '@/utils/selectContents'
import {
  $guitarParts,
  setGuitarPartsByPopularity,
  setGuitarPartsCheapFirst,
  setGuitarPartsExpensiveFirst,
} from '@/context/guitarParts'
import { useRouter } from 'next/router'

const FilterSelect = ({
  setSpinner,
}: {
  setSpinner: (arg0: boolean) => void
}) => {
  const mode = useStore($mode)
  const guitarParts = useStore($guitarParts)
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null)
  const router = useRouter()

  useEffect(() => {
    if (guitarParts.rows) {
      switch (router.query.first) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые')
          setGuitarPartsCheapFirst()
          break
        case 'expensive':
          updateCategoryOption('Сначала дорогие')
          setGuitarPartsExpensiveFirst()
          break
        case 'popular':
          updateCategoryOption('По популярности')
          setGuitarPartsByPopularity()
          break
        default:
          updateCategoryOption('Сначала дешевые')
          setGuitarPartsCheapFirst()
          break
      }
    }
  }, [guitarParts.rows, router.query.first])

  const updateCategoryOption = (value: string) =>
    setCategoryOption({ value, label: value })

  const updateRoteParam = (first: string) =>
    router.push(
      {
        query: {
          ...router.query,
          first,
        },
      },
      undefined,
      { shallow: true }
    )

  const handleSortOptionChange = (selectedOption: SelectOptionType) => {
    setSpinner(true)
    setCategoryOption(selectedOption)

    switch ((selectedOption as IOption).value) {
      case 'Сначала дешевые':
        setGuitarPartsCheapFirst()
        updateRoteParam('cheap')
        break
      case 'Сначала дорогие':
        setGuitarPartsExpensiveFirst()
        updateRoteParam('expensive')
        break
      case 'По популярности':
        setGuitarPartsByPopularity()
        updateRoteParam('popular')
        break
    }

    setTimeout(() => setSpinner(false), 1000)
  }

  return (
    <Select
      placeholder="Я ищу..."
      value={categoryOption || createSelectOption('Сначала дешевые')}
      onChange={handleSortOptionChange}
      styles={{
        ...selectStyles,
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isSearchable={false}
      options={categoriesOptions}
    />
  )
}

export default FilterSelect
