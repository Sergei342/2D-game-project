import { initMainPage, MainPage } from '../pages/Main'
import { initFriendsPage, FriendsPage } from '../pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initRegisterPage, RegisterPage } from '../pages/register/Register'

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
    path: '/register',
    Component: RegisterPage,
    fetchData: initRegisterPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
