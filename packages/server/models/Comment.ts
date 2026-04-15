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
  HasMany,
} from 'sequelize-typescript'
import { Topic } from './Topic'
import { UserProfile } from './UserProfile'
import { Reaction } from './Reaction'

/**
 * Одна таблица для комментариев и ответов, у комментариев просто нет parentId
 *
 */
@Table({ tableName: 'comments', timestamps: true })
export class Comment extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare text: string

  @ForeignKey(() => UserProfile)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @BelongsTo(() => UserProfile)
  declare author: UserProfile

  @ForeignKey(() => Topic)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare topicId: number

  @BelongsTo(() => Topic)
  declare topic: Topic

  @ForeignKey(() => Comment)
  @Column(DataType.INTEGER)
  declare parentId: number | null

  @BelongsTo(() => Comment, 'parentId')
  declare parent: Comment | null

  @HasMany(() => Comment, 'parentId')
  declare replies: Comment[]

  @HasMany(() => Reaction)
  declare reactions: Reaction[]
}
