import {
  Model,
  Table,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { Comment } from './Comment'
import { UserProfile } from './UserProfile'

/**
 * Один пользователь может поставить одну реакцию на один комментарий.
 * Тип реакции — строка с эмодзи: "👍", "❤️", "😂", "😢", "😡"
 *
 */
@Table({
  tableName: 'reactions',
  timestamps: false,
  indexes: [{ unique: true, fields: ['commentId', 'userId'] }],
})
export class Reaction extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING)
  declare type: string

  @ForeignKey(() => UserProfile)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare userId: number

  @BelongsTo(() => UserProfile)
  declare user: UserProfile

  @ForeignKey(() => Comment)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare commentId: number

  @BelongsTo(() => Comment)
  declare comment: Comment
}
