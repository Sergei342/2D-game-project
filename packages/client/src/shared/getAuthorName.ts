import { profileService } from '@/pages/profile/ProfileService'

const AUTHOR_KEY = 'forum_author_v1'

export const getAuthorName = async (): Promise<string> => {
  const cached = localStorage.getItem(AUTHOR_KEY)
  if (cached) return cached

  try {
    const user = await profileService.getUser()

    const name =
      user?.display_name ||
      [user?.first_name, user?.second_name].filter(Boolean).join(' ') ||
      user?.login ||
      'Anonymous'

    localStorage.setItem(AUTHOR_KEY, name)
    return name
  } catch {
    return 'Anonymous'
  }
}
