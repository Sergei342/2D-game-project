import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

export const AuthLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Outlet />
      </Content>
    </Layout>
  )
}
