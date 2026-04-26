import { useActiveMenuKey } from '@/hooks/useActiveMenuKey'
import { MenuItem } from '@/types'
import { Layout, Menu } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
const { Header, Content, Footer } = Layout

const menuItems: MenuItem[] = [
  { key: '/', label: 'Главная', match: '/' },
  { key: '/game', label: 'Игра', match: '/game/*' },
  { key: '/forum', label: 'Форум', match: '/forum/*' },
  { key: '/leaderboard', label: 'Таблица лидеров', match: '/leaderboard/*' },
  { key: '/profile', label: 'Профиль', match: '/profile/*' },
]

export const AppLayout = () => {
  const navigate = useNavigate()
  const activeKey = useActiveMenuKey({ menuItems }) as string

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          overflowX: 'auto',
        }}>
        <div className="arcade-glow" onClick={() => navigate('/')}>
          👾 SPACE INVADERS
        </div>

        <Menu
          style={{ minWidth: 0, flex: 'auto', flexShrink: 0 }}
          theme="dark"
          mode="horizontal"
          items={menuItems}
          selectedKeys={[activeKey]}
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
