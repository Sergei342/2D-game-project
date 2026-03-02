import { Result, Button, Typography, Space } from 'antd'
import { BugOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons'
import { useRouteError, useNavigate } from 'react-router-dom'
import { cssVariables } from '../../styles/variables'

const { Paragraph, Text } = Typography

export const AppErrorBoundary = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  const isDev = import.meta.env.DEV

  return (
    <Result
      icon={<BugOutlined style={{ color: cssVariables.errorColor }} />}
      title="Сервис временно недоступен"
      subTitle="Произошла ошибка при работе сервиса. Мы уже чиним."
      status="error"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}>
            Перезагрузка
          </Button>

          <Button icon={<HomeOutlined />} onClick={() => navigate('/')}>
            На Главную
          </Button>
        </Space>
      }>
      {isDev && (
        <Paragraph>
          <Text type="danger">Debug info:</Text>
          <pre
            style={{
              marginTop: 8,
              padding: 12,
              background: cssVariables.bgColor,
              borderRadius: 6,
              color: cssVariables.textColor,
              maxWidth: 600,
              overflow: 'auto',
            }}>
            {String(error)}
          </pre>
        </Paragraph>
      )}
    </Result>
  )
}
