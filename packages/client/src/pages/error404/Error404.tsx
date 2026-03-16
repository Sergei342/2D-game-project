import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import './Error404.scss'

export const Error404Page = () => {
  const navigate = useNavigate()

  return (
    <div className="error404">
      <div className="error404__container">
        <h1 className="error404__title">404</h1>
        <p className="error404__text">Такой страницы не существует</p>
        <Button
          type="primary"
          size="large"
          onClick={() => {
            navigate('/')
          }}>
          Перейти к игре
        </Button>
      </div>
    </div>
  )
}

export const initError404Page = () => Promise.resolve()
