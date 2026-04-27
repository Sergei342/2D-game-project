import { useActiveMenuKey } from '@/hooks/useActiveMenuKey'
import { logoutUser } from '@/pages/login/LoginService'
import { clearUser } from '@/slices/userSlice'
import { useDispatch } from '@/store'
import { MenuItem } from '@/types'
import { Button, Layout, Menu, message } from 'antd'
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
  const dispatch = useDispatch()

  const activeKey = useActiveMenuKey({ menuItems }) as string

  const handleLogout = async () => {
    const success = await logoutUser()

    if (success) {
      dispatch(clearUser())
      navigate('/login')
    } else {
      message.error('Не удалось выйти. Попробуйте позже.')
    }
  }

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

        <Button type="link" danger onClick={handleLogout}>
          Выйти
        </Button>
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
