import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import './Error500.scss'

export const Error500Page = () => {
  const navigate = useNavigate()

  return (
    <div className="error500">
      <div className="error500__container">
        <h1 className="error500__title">500</h1>
        <p className="error500__text">Что-то пошло не так. Попробуйте позже.</p>
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

export const initError500Page = () => Promise.resolve()
