import { Button, Switch, Typography } from 'antd'
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import {
  WebApiSectionContainer,
  WebApiStatus,
  WebApiStatusText,
  WebApiErrorBlock,
  NotificationSettingRow,
  NotificationSettingLabel,
  StatusIcon,
  SectionHint,
} from './ProfilePage.styled'
import { useNotification } from '@/hooks/useNotification'

const { Text } = Typography

const PERMISSION_TEXT: Record<string, string> = {
  granted: 'Уведомления разрешены',
  denied: 'Уведомления заблокированы в настройках браузера',
  default: 'Разрешение не запрошено',
  unsupported: 'Ваш браузер не поддерживает уведомления',
}

export const NotificationSection = () => {
  const { permission, enabled, requestPermission, toggleEnabled } =
    useNotification()

  return (
    <WebApiSectionContainer>
      {permission !== 'unsupported' && permission !== 'granted' && (
        <Button
          type="primary"
          icon={<BellOutlined />}
          onClick={requestPermission}
          disabled={permission === 'denied'}
          block>
          {permission === 'denied'
            ? 'Разблокируйте в настройках браузера'
            : 'Разрешить уведомления'}
        </Button>
      )}

      <WebApiStatus>
        <StatusIcon $granted={permission === 'granted'}>
          {permission === 'granted' ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )}
        </StatusIcon>
        <WebApiStatusText>{PERMISSION_TEXT[permission]}</WebApiStatusText>
      </WebApiStatus>

      {permission === 'denied' && (
        <WebApiErrorBlock>
          <Text type="danger">
            Чтобы включить, разрешите уведомления для этого сайта в настройках
            браузера (иконка замка в адресной строке)
          </Text>
        </WebApiErrorBlock>
      )}

      {permission === 'granted' && (
        <>
          <SectionHint>
            Уведомления приходят, когда вкладка не в фокусе
          </SectionHint>

          <NotificationSettingRow>
            <NotificationSettingLabel>
              Игра без присмотра
            </NotificationSettingLabel>
            <Switch checked={enabled} onChange={toggleEnabled} size="small" />
          </NotificationSettingRow>
        </>
      )}
    </WebApiSectionContainer>
  )
}
