import { IGuitarPart } from './guitarparts'

export interface IDashboardSlider {
  items: IGuitarPart[]
  spinner: boolean
  goToPartPage?: boolean
}

export interface ICartAlertProps {
  count: number
  closeAlert: VoidFunction
}
