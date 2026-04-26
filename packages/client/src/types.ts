import { MenuProps } from 'antd'
import { AppDispatch, RootState } from './store'

export type MenuItem = Required<MenuProps>['items'][number] & {
  match: string
}

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}
