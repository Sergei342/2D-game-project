import { Button, Typography } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import {
  WebApiSectionContainer,
  WebApiStatus,
  WebApiStatusText,
  WebApiErrorBlock,
  GeoResult,
  GeoCoords,
  GeoMapLink,
} from './ProfilePage.styled'
import { COORD_ROUND_VALUE, OSM_BASE_URL, OSM_DEFAULT_ZOOM } from './consts'
import { useGeolocation } from '@/hooks/useGeolocation'

const { Text } = Typography

export const GeoSectionContent = () => {
  const { coords, loading, error, status, locate } = useGeolocation()

  return (
    <WebApiSectionContainer>
      <Button
        type="primary"
        icon={<EnvironmentOutlined />}
        onClick={locate}
        loading={loading}
        block>
        Определить местоположение
      </Button>

      {status && !loading && (
        <WebApiStatus>
          <WebApiStatusText>{status}</WebApiStatusText>
        </WebApiStatus>
      )}

      {error && (
        <WebApiErrorBlock>
          <Text type="danger">{error}</Text>
        </WebApiErrorBlock>
      )}

      {coords && (
        <GeoResult>
          <GeoCoords>
            <Text>
              Широта:{' '}
              <Text strong>{coords.latitude.toFixed(COORD_ROUND_VALUE)}</Text>
            </Text>
            <Text>
              Долгота:{' '}
              <Text strong>{coords.longitude.toFixed(COORD_ROUND_VALUE)}</Text>
            </Text>
          </GeoCoords>
          <GeoMapLink
            href={`${OSM_BASE_URL}/#map=${OSM_DEFAULT_ZOOM}/${coords.latitude}/${coords.longitude}`}
            target="_blank"
            rel="noopener noreferrer">
            <EnvironmentOutlined /> Посмотреть на карте
          </GeoMapLink>
        </GeoResult>
      )}
    </WebApiSectionContainer>
  )
}
