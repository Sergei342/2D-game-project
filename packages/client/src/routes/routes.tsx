import { initLoginPage, LoginPage } from '../pages/login/Login'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'
import { initProfilePage, ProfilePage } from '../pages/profile/ProfilePage'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { GamePage, initGamePage } from '../pages/game/components/GamePage'
import { Error500Page, initError500Page } from '../pages/error500/Error500'
import { Error404Page, initError404Page } from '../pages/error404/Error404'
import { initMainPage, MainPage } from '@/pages/Main'
import { initFriendsPage, FriendsPage } from '@/pages/FriendsPage'

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
import { RegisterPage, initRegisterPage } from '@/pages/register/Register'
import { LeaderBoardPage } from '@/pages/leaderboard'
import { initLeaderBoardPage } from '@/pages/leaderboard/LeaderBoardPage'
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
    path: '/login',
    Component: () => (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
    fetchData: initLoginPage,
    ErrorBoundary: AppErrorBoundary,
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
    Component: Error404Page,
    fetchData: initError404Page,
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
  {
    path: '/register',
    Component: () => (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
    fetchData: initRegisterPage,
    ErrorBoundary: AppErrorBoundary,
  },
  {
    path: '/leaderboard',
    Component: () => (
      <ProtectedRoute>
        <LeaderBoardPage />
      </ProtectedRoute>
    ),
    fetchData: initLeaderBoardPage,
    ErrorBoundary: AppErrorBoundary,
  },
]
