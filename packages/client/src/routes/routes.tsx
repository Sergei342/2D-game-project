import { initMainPage, MainPage } from '../pages/Main'
import { initFriendsPage, FriendsPage } from '../pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initProfilePage, ProfilePage } from '../pages/profile/ProfilePage'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { GamePage, initGamePage } from '../pages/Game'

export const routes = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/game',
    Component: GamePage,
    fetchData: initGamePage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/profile',
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
]
