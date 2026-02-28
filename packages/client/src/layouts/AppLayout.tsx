import { Layout, Menu } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'

const { Header, Content, Footer } = Layout

const menuItems: MenuProps['items'] = [
  { key: '/', label: 'Главная' },
  { key: '/game', label: 'Игра' },
  { key: '/forum', label: 'Форум' },
  { key: '/profile', label: 'Профиль' },
]

export const AppLayout = () => {
  const navigate = useNavigate()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="arcade-glow" onClick={() => navigate('/')}>
          👾 SPACE INVADERS
        </div>

        <Menu
          style={{ alignSelf: 'flex-end' }}
          theme="dark"
          mode="horizontal"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Header>

      <Content style={{ padding: '24px', flex: 1 }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Space Invaders © {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}
