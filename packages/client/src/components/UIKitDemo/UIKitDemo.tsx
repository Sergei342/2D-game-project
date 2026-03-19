import React from 'react'
import {
  Button,
  Input,
  Typography,
  Card,
  Space,
  Checkbox,
  Menu,
  Flex,
} from 'antd'
import { UserOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { cssVariables } from '@/styles/variables'

const { Title, Paragraph, Text } = Typography

export const UIKitDemo = () => {
  return (
    <div>
      <Title level={2}>UIKit Demo - Space Invaders</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Paragraph>
          <Text>Демо основных компонентов Ant Design</Text>
        </Paragraph>

        <Input
          placeholder="Введите имя игрока"
          prefix={<UserOutlined style={{ color: cssVariables.borderColor }} />}
          style={{
            background: cssVariables.bgColor,
            color: cssVariables.textColor,
            borderColor: cssVariables.borderColor,
          }}
        />

        {/* Кнопки */}
        <Flex gap={10}>
          <Button type="primary">Играть</Button>
          <Button type="default">Настройки</Button>
        </Flex>

        {/* Чекбоксы */}
        <Checkbox style={{ color: cssVariables.borderColor }}>
          Включить музыку
        </Checkbox>

        {/* Карточка */}
        <Card
          title={
            <Text style={{ color: cssVariables.borderColor }}>
              Информация об игроке
            </Text>
          }
          variant="borderless">
          <Paragraph>
            Игрок: <Text strong>Player1</Text>
          </Paragraph>
          <Paragraph>
            Уровень: <Text strong>5</Text>
          </Paragraph>
        </Card>

        {/* Меню */}
        <Menu
          mode="horizontal"
          items={[
            { key: '1', label: 'Главная' },
            { key: '2', label: 'Играть', icon: <PlayCircleOutlined /> },
            { key: '3', label: 'Форум' },
            { key: '4', label: 'Профиль' },
          ]}
        />
      </Space>
    </div>
  )
}
