import { initMainPage, MainPage } from '../pages/Main'
import { initFriendsPage, FriendsPage } from '../pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initLoginPage, LoginPage } from '../pages/login/Login'

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
    path: '/login',
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
