import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const ForumPage = () => {
  usePage({ initPage: initForumPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Форум для обсуждений" />
      </Helmet>
      <Header />
      <h1>Форум</h1>
      <ul>
        <li>
          <Link to="/forum/1">Топик #1 — Обсуждение игры</Link>
        </li>
        <li>
          <Link to="/forum/2">Топик #2 — Баги и предложения</Link>
        </li>
        <li>
          <Link to="/forum/3">Топик #3 — Общение</Link>
        </li>
      </ul>
    </div>
  )
}

export const initForumPage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы форума
}
