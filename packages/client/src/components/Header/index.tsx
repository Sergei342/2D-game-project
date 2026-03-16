import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/register">Регистрация</Link>
        </li>
        <li>
          <Link to="/login">Войти</Link>
        </li>
        <li>
          <Link to="/forum">Форум</Link>
        </li>
        <li>
          <Link to="/profile">Профиль</Link>
        </li>
        <li>
          <Link to="/game">Игра</Link>
        </li>
        <li>
          <Link to="/500">500</Link>
        </li>
      </ul>
    </nav>
  )
}
