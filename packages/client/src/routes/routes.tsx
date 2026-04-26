import type { AppRouteObject } from './types'

import { initLoginPage, LoginPage } from '../pages/login/Login'
import { GuestRoute, ProtectedRoute } from './ProtectedRoute'
import { initProfilePage, ProfilePage } from '../pages/profile/ProfilePage'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { GamePage, initGamePage } from '../pages/game/components/GamePage'
import { Error500Page } from '../pages/error500/Error500'
import { Error404Page } from '../pages/error404/Error404'
import { initMainPage, MainPage } from '@/pages/Main'

import { ForumTopicsPage } from '@/pages/forum/ForumTopicsPage'
import { ForumCreateTopicPage } from '@/pages/forum/ForumCreateTopicPage'
import { ForumTopicPage } from '@/pages/forum/ForumTopicPage'
import { RegisterPage, initRegisterPage } from '@/pages/register/Register'
import { LeaderBoardPage } from '@/pages/leaderboard'
import { initLeaderBoardPage } from '@/pages/leaderboard/LeaderBoardPage'
import { ForumEditTopicPage } from '@/pages/forum/ForumEditTopicPage'
import { initForumTopicsPage } from '@/pages/forum/ForumTopicsPage/ForumTopicsPage'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { initOAuthPage, OAuthPage } from '@/pages/oauth/OAuthPage'

export const routes: AppRouteObject[] = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            path: 'login',
            Component: LoginPage,
            fetchData: initLoginPage,
            ErrorBoundary: AppErrorBoundary,
          },
          {
            path: 'register',
            Component: RegisterPage,
            fetchData: initRegisterPage,
            ErrorBoundary: AppErrorBoundary,
          },
          {
            path: 'oauth',
            Component: OAuthPage,
            fetchData: initOAuthPage,
            ErrorBoundary: AppErrorBoundary,
          }
        ],
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            Component: MainPage,
            fetchData: initMainPage,
            ErrorBoundary: AppErrorBoundary,
          },
          {
            path: 'forum',
            children: [
              {
                index: true,
                Component: ForumTopicsPage,
                fetchData: initForumTopicsPage,
                ErrorBoundary: AppErrorBoundary,
              },
              {
                path: 'new',
                Component: ForumCreateTopicPage,
                ErrorBoundary: AppErrorBoundary,
              },
              {
                path: ':topicId',
                children: [
                  {
                    index: true,
                    Component: ForumTopicPage,
                    ErrorBoundary: AppErrorBoundary,
                  },
                  {
                    path: 'edit',
                    Component: ForumEditTopicPage,
                    ErrorBoundary: AppErrorBoundary,
                  },
                ],
              },
            ],
          },
          {
            path: 'game',
            Component: GamePage,
            fetchData: initGamePage,
            ErrorBoundary: AppErrorBoundary,
          },
          {
            path: 'leaderboard',
            Component: LeaderBoardPage,
            fetchData: initLeaderBoardPage,
            ErrorBoundary: AppErrorBoundary,
          },
          {
            path: 'profile',
            Component: ProfilePage,
            fetchData: initProfilePage,
            ErrorBoundary: AppErrorBoundary,
          },
        ],
      },
      {
        path: '500',
        Component: Error500Page,
        ErrorBoundary: AppErrorBoundary,
      },
      {
        path: '*',
        Component: Error404Page,
        ErrorBoundary: AppErrorBoundary,
      },
    ],
  },
]
