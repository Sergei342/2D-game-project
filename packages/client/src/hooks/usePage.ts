import { useEffect, useRef } from 'react'
import { useDispatch, useSelector, useStore } from '@/store'
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '@/slices/ssrSlice'
import { PageInitArgs, PageInitContext } from '@/types'

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
})

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown> | unknown
}

export const usePage = ({ initPage }: PageProps) => {
  const dispatch = useDispatch()
  const pageHasBeenInitializedOnServer = useSelector(
    selectPageHasBeenInitializedOnServer
  )
  const store = useStore()

  const shouldSkipFirstClientInit = useRef(pageHasBeenInitializedOnServer)

  useEffect(() => {
    if (shouldSkipFirstClientInit.current) {
      shouldSkipFirstClientInit.current = false
      dispatch(setPageHasBeenInitializedOnServer(false))
      return
    }

    void initPage({
      dispatch,
      state: store.getState(),
      ctx: createContext(),
    })
  }, [dispatch, initPage, store])
}
