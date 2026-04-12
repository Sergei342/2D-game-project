import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppDispatch, RootState } from '@/store'
import { RouteObject } from 'react-router-dom'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const templates = {
  app: AppLayout,
  auth: AuthLayout,
} as const

export type TemplateKey = keyof typeof templates

export type AppRouteObject = RouteObject & {
  fetchData?: (args: PageInitArgs) => Promise<unknown> | unknown
  children?: AppRouteObject[]
}
