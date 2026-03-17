import { profileService } from '@/pages/profile/ProfileService'

const KEY = 'forum_author_info_v1'

export type AuthorInfo = {
  name: string
  avatar: string | null
}

export const getAuthorInfo = async (): Promise<AuthorInfo> => {
  const cached = localStorage.getItem(KEY)
  if (cached) return JSON.parse(cached) as AuthorInfo

  try {
    const user = await profileService.getUser()

    const name =
      user?.display_name ||
      [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
      user?.login ||
      'Anonymous'

    const avatar = profileService.avatarUrl(user?.avatar ?? null)

    const info: AuthorInfo = { name, avatar }
    localStorage.setItem(KEY, JSON.stringify(info))
    return info
  } catch {
    return { name: 'Anonymous', avatar: null }
  }
}
