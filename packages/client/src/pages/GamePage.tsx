import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const GamePage = () => {
  usePage({ initPage: initGamePage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <Header />
      <h1>Игра</h1>
      <p>Здесь будет игра. Контент в разработке...</p>
    </div>
  )
}

export const initGamePage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы игры
}
