import { Spin } from 'antd'

export const FullscreenLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}>
    <Spin size="large" />
  </div>
)
