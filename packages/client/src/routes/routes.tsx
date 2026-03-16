import { initMainPage, MainPage } from '@/pages/Main'
import { initFriendsPage, FriendsPage } from '@/pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '@/pages/NotFound'
import { initLoginPage, LoginPage } from '@/pages/login/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { initProfilePage, ProfilePage } from '@/pages/profile/ProfilePage'
import { AppErrorBoundary } from '@/components/AppErrorBoundary'
import { GamePage, initGamePage } from '@/pages/game/components/GamePage'
import { Error500Page, initError500Page } from '@/pages/error500/Error500'
import { Error404Page, initError404Page } from '@/pages/error404/Error404'
import {
  initForumTopicsPage,
  ForumTopicsPage,
} from '@/pages/forum/ForumTopicsPage'
import {
  initForumCreateTopicPage,
  ForumCreateTopicPage,
} from '@/pages/forum/ForumCreateTopicPage'
import {
  initForumTopicPage,
  ForumTopicPage,
} from '@/pages/forum/ForumTopicPage'

export const routes = [
  {
    path: '/',
    Component: () => (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
    fetchData: initMainPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/friends',
    Component: () => (
      <ProtectedRoute>
        <FriendsPage />
      </ProtectedRoute>
    ),
    fetchData: initFriendsPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/game',
    Component: GamePage,
    fetchData: initGamePage,
  },
  {
    path: '/500',
    Component: Error500Page,
    fetchData: initError500Page,
  },
  {
    path: '/404',
    Component: Error404Page,
    fetchData: initError404Page,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/login',
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: '/forum',
    Component: ForumTopicsPage,
    fetchData: initForumTopicsPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/new',
    Component: ForumCreateTopicPage,
    fetchData: initForumCreateTopicPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/:topicId',
    Component: ForumTopicPage,
    fetchData: initForumTopicPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/profile',
    Component: ProfilePage,
    fetchData: initProfilePage,
    ErrorBoundary: AppErrorBoundary,
  },
]
