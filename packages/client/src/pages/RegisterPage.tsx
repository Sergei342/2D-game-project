import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const RegisterPage = () => {
  usePage({ initPage: initRegisterPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация</title>
        <meta
          name="description"
          content="Страница регистрации нового пользователя"
        />
      </Helmet>
      <Header />
      <h1>Регистрация</h1>
    </div>
  )
}

export const initRegisterPage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы регистрации
}
