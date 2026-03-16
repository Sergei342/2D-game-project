import { initMainPage, MainPage } from '../pages/Main'
import { initFriendsPage, FriendsPage } from '../pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from '../pages/NotFound'
import { initRegisterPage, RegisterPage } from '../pages/register/Register'
import { initLoginPage, LoginPage } from '../pages/login/Login'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'
import { initProfilePage, ProfilePage } from '../pages/profile/ProfilePage'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { GamePage, initGamePage } from '../pages/game/components/GamePage'
import { Error500Page, initError500Page } from '../pages/error500/Error500'
import { Error404Page, initError404Page } from '../pages/error404/Error404'
import {
  initForumTopicsPage,
  ForumTopicsPage,
} from '../pages/forum/ForumTopicsPage'
import {
  initForumCreateTopicPage,
  ForumCreateTopicPage,
} from '../pages/forum/ForumCreateTopicPage'
import {
  initForumTopicPage,
  ForumTopicPage,
} from '../pages/forum/ForumTopicPage'

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
    path: '/register',
    Component: RegisterPage,
    fetchData: initRegisterPage,
  },
  {
    path: '/game',
    Component: () => (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    fetchData: initGamePage,
    ErrorBoundary: AppErrorBoundary,
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
    Component: () => (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
    fetchData: initLoginPage,
  },
  {
    path: '/forum',
    Component: () => (
      <ProtectedRoute>
        <ForumTopicsPage />
      </ProtectedRoute>
    ),
    fetchData: initForumTopicsPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/new',
    Component: () => (
      <ProtectedRoute>
        <ForumCreateTopicPage />
      </ProtectedRoute>
    ),
    fetchData: initForumCreateTopicPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/:topicId',
    Component: () => (
      <ProtectedRoute>
        <ForumTopicPage />
      </ProtectedRoute>
    ),
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
    Component: () => (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    fetchData: initProfilePage,
    ErrorBoundary: AppErrorBoundary,
  },
]
