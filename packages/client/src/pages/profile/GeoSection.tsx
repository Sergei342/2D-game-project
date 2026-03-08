import { Button, Spin, Typography } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import {
  GeoSectionContainer,
  GeoStatus,
  GeoStatusText,
  GeoErrorBlock,
  GeoResult,
  GeoCoords,
  GeoMapLink,
} from './ProfilePage.styled'
import { COORD_ROUND_VALUE, OSM_BASE_URL, OSM_DEFAULT_ZOOM } from './consts'

const { Text } = Typography

interface GeoSectionProps {
  geoStatus: string | null
  geoCoords: { latitude: number; longitude: number } | null
  geoLoading: boolean
  geoError: string | null
  onFindMe: () => void
}

export const GeoSectionContent = ({
  geoStatus,
  geoCoords,
  geoLoading,
  geoError,
  onFindMe,
}: GeoSectionProps) => (
  <GeoSectionContainer>
    <Button
      type="primary"
      icon={<EnvironmentOutlined />}
      onClick={onFindMe}
      loading={geoLoading}
      block>
      Определить местоположение
    </Button>

    {geoStatus && !geoLoading && (
      <GeoStatus>
        <GeoStatusText>{geoStatus}</GeoStatusText>
      </GeoStatus>
    )}

    {geoError && (
      <GeoErrorBlock>
        <Text type="danger">{geoError}</Text>
      </GeoErrorBlock>
    )}

    {geoCoords && (
      <GeoResult>
        <GeoCoords>
          <Text>
            Широта:{' '}
            <Text strong>{geoCoords.latitude.toFixed(COORD_ROUND_VALUE)}</Text>
          </Text>
          <Text>
            Долгота:{' '}
            <Text strong>{geoCoords.longitude.toFixed(COORD_ROUND_VALUE)}</Text>
          </Text>
        </GeoCoords>
        <GeoMapLink
          href={`${OSM_BASE_URL}/#map=${OSM_DEFAULT_ZOOM}/${geoCoords.latitude}/${geoCoords.longitude}`}
          target="_blank"
          rel="noopener noreferrer">
          <EnvironmentOutlined /> Посмотреть на карте
        </GeoMapLink>
      </GeoResult>
    )}
  </GeoSectionContainer>
)
