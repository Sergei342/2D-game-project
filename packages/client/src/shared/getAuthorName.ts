import { UserProfile } from '@/pages/profile/ProfileService'

export const getAuthorName = (user: UserProfile): string => {
  try {
    const name =
      user.display_name ||
      [user.first_name, user.second_name].filter(Boolean).join(' ') ||
      user.login ||
      'Anonymous'

    return name
  } catch {
    return 'Anonymous'
  }
}
