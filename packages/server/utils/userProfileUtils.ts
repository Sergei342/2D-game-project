import { UserProfile } from '../models/UserProfile'
import type { UserProfileDTO } from '../types/dto'

export async function updateUserProfile(
  authorId: number,
  displayName: string,
  avatar?: string | null
): Promise<void> {
  const data: UserProfileDTO = { id: authorId, displayName }

  if (avatar !== undefined) {
    data.avatar = avatar
  }

  await UserProfile.upsert({ ...data })
}
