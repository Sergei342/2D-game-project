import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const ForumTopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>()

  usePage({ initPage: initForumTopicPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`Топик #${topicId}`}</title>
        <meta name="description" content={`Страница топика #${topicId}`} />
      </Helmet>
      <Header />
      <h1>Топик #{topicId}</h1>
      <p>Здесь будет содержимое топика. Контент в разработке...</p>
    </div>
  )
}

export const initForumTopicPage = async (args: PageInitArgs) => {
  // Заглушка для инициализации страницы топика форума
}
