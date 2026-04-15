import { UserProfile } from '../models/UserProfile'

export async function updateUserProfile(
  authorId: number,
  displayName: string,
  avatar?: string | null
): Promise<void> {
  const existing = await UserProfile.findByPk(authorId)

  if (existing) {
    let changed = false

    if (displayName && existing.displayName !== displayName) {
      existing.displayName = displayName
      changed = true
    }

    if (avatar !== undefined && existing.avatar !== avatar) {
      existing.avatar = avatar
      changed = true
    }

    if (changed) {
      await existing.save()
    }
  } else {
    await UserProfile.create({
      id: authorId,
      displayName,
      avatar: avatar ?? null,
    })
  }
}
