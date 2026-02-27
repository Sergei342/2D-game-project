import { initMainPage, MainPage } from '../pages/Main'
import { initFriendsPage, FriendsPage } from '../pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'

export const routes = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
