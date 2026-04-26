import { MenuItem } from '@/types'
import { useLocation, matchPath } from 'react-router-dom'

type UseActiveMenuKeysProps = {
  menuItems: MenuItem[]
}

export const useActiveMenuKey = ({ menuItems }: UseActiveMenuKeysProps) => {
  const { pathname } = useLocation()

  const active = menuItems.find(item =>
    matchPath({ path: item.match, end: item.match === '/' }, pathname)
  )

  return active?.key ?? '/'
}
