import { Helmet } from 'react-helmet'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Таблица лидеров" />
      </Helmet>
      <Header />
      <h1>Лидерборд</h1>
      <table>
        <thead>
          <tr>
            <th>Место</th>
            <th>Игрок</th>
            <th>Очки</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>—</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const initLeaderboardPage = async (_args: PageInitArgs) => {
  // Заглушка для инициализации страницы лидерборда
}
