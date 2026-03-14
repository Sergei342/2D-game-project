import App from './App'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './store'

global.fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve(null) })
) as unknown as typeof global.fetch

test('Example test', async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(await screen.findByText('Пользователь не найден!')).toBeDefined()
})
