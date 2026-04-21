import type { AppRouteObject } from './types'

import { initLoginPage, LoginPage } from '../pages/login/Login'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'
import { initProfilePage, ProfilePage } from '../pages/profile/ProfilePage'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { GamePage, initGamePage } from '../pages/game/components/GamePage'
import { Error500Page, initError500Page } from '../pages/error500/Error500'
import { Error404Page, initError404Page } from '../pages/error404/Error404'
import { initMainPage, MainPage } from '@/pages/Main'
import { initFriendsPage, FriendsPage } from '@/pages/FriendsPage'

import { ForumTopicsPage } from '@/pages/forum/ForumTopicsPage'
import { ForumCreateTopicPage } from '@/pages/forum/ForumCreateTopicPage'
import { ForumTopicPage } from '@/pages/forum/ForumTopicPage'
import { RegisterPage, initRegisterPage } from '@/pages/register/Register'
import { LeaderBoardPage } from '@/pages/leaderboard'
import { initLeaderBoardPage } from '@/pages/leaderboard/LeaderBoardPage'
import { ForumEditTopicPage } from '@/pages/forum/ForumEditTopicPage'

export const routes: AppRouteObject[] = [
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
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/game',
    Component: () => (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/500',
    Component: Error500Page,
  },
  {
    path: '/login',
    Component: () => (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum',
    Component: () => (
      <ProtectedRoute>
        <ForumTopicsPage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/new',
    Component: () => (
      <ProtectedRoute>
        <ForumCreateTopicPage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/:topicId',
    Component: () => (
      <ProtectedRoute>
        <ForumTopicPage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/forum/:topicId/edit',
    Component: () => (
      <ProtectedRoute>
        <ForumEditTopicPage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/profile',
    Component: () => (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/register',
    Component: () => (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/leaderboard',
    Component: () => (
      <ProtectedRoute>
        <LeaderBoardPage />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/*',
    Component: Error404Page,
    ErrorBoundary: AppErrorBoundary,
  },
]
