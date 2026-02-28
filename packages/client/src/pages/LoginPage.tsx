import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const LoginPage = () => {
  usePage({ initPage: initLoginPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход</title>
        <meta name="description" content="Страница входа в аккаунт" />
      </Helmet>
      <Header />
      <h1>Вход</h1>
      <form>
        <div>
          <label htmlFor="login">Логин</label>
          <input id="login" type="text" placeholder="Введите логин" />
        </div>
        <div>
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" placeholder="Введите пароль" />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  )
}

export const initLoginPage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы логина
}
