import { IGuitarPart } from '@/types/guitarparts'
import { createDomain } from 'effector-next'

const guitarPart = createDomain()

export const setGuitarPart = guitarPart.createEvent<IGuitarPart>()

export const $guitarPart = guitarPart
  .createStore<IGuitarPart>({} as IGuitarPart)
  .on(setGuitarPart, (_, part) => part)
