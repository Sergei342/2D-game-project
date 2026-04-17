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
import { UserProfile } from './UserProfile'

@Table({ tableName: 'topics', timestamps: true })
export class Topic extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number

  @AllowNull(false)
  @Column(DataType.STRING)
  declare title: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare description: string

  @ForeignKey(() => UserProfile)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare authorId: number

  @BelongsTo(() => UserProfile)
  declare author: UserProfile
}
