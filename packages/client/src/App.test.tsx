import App from './App'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createAppStore } from './store'

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(null) })
) as unknown as typeof global.fetch

const store = createAppStore()

jest.mock('@/shared/constants', () => ({
  FORUM_API: 'forum-api-url',
  BASE_URL: 'base-api-url',
}))

test('Example test', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(await screen.findByText('Пользователь не найден!')).toBeDefined()
})
