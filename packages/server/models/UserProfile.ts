import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript'

/**
 * Таблица профиль пользователя в нашем проекте,
 * PK = externalId (id из Яндекс API), НЕ автоинкремент!
 * Создаётся/обновляется при первом действии пользователя (создание топика, комментария),
 * чтобы не хранить данные в таблице топика и сообщения.
 * Можно сюда добавить тему (theme) и другие настройки.
 *
 */
@Table({ tableName: 'user_profiles', timestamps: true })
export class UserProfile extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING)
  declare displayName: string

  @Column(DataType.STRING)
  declare avatar: string | null
}
