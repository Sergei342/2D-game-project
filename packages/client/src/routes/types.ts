import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PageInitArgs } from '@/types'
import { RouteObject } from 'react-router-dom'

export const templates = {
  app: AppLayout,
  auth: AuthLayout,
} as const

export type TemplateKey = keyof typeof templates

export type AppRouteObject = RouteObject & {
  fetchData?: (args: PageInitArgs) => Promise<unknown> | unknown
  children?: AppRouteObject[]
}
