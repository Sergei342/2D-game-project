import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Страница профиля пользователя" />
      </Helmet>
      <Header />
      <h1>Профиль</h1>
    </div>
  )
}

export const initProfilePage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы профиля
}
