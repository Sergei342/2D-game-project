import { Helmet } from 'react-helmet'

import { useSelector } from '../store'
import {
  fetchFriendsThunk,
  selectFriends,
  selectIsLoadingFriends,
  selectFriendsError,
} from '../slices/friendsSlice'
import { selectUser } from '../slices/userSlice'
import { PageInitArgs } from '../types'
import { usePage } from '../hooks/usePage'

export const FriendsPage = () => {
  const friends = useSelector(selectFriends)
  const isLoading = useSelector(selectIsLoadingFriends)
  const error = useSelector(selectFriendsError)
  const user = useSelector(selectUser)

  usePage({ initPage: initFriendsPage })

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Список друзей</title>
        <meta
          name="description"
          content="Страница со списком друзей и с информацией о пользователе"
        />
      </Helmet>

      {user ? (
        <>
          <h3>Информация о пользователе:</h3>
          <p>
            {user.first_name} {user.second_name}
          </p>
        </>
      ) : (
        <h3>Пользователь не найден</h3>
      )}

      {isLoading ? (
        <p>Загрузка списка...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {friends.map(friend => (
            <li key={`${friend.name}-${friend.secondName}`}>
              {friend.name} {friend.secondName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const initFriendsPage = ({ dispatch }: PageInitArgs) => {
  return dispatch(fetchFriendsThunk())
}
