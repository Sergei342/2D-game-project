export const isToday = (date: Date): boolean => {
  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export const formatISODate = (isoDate: string): string => {
  if (!isoDate) {
    return ''
  }

  const date = new Date(isoDate)

  return formatDate(date)
}

export const isUpdated = (isoDateCreated: string, isoDateUpdated: string) => {
  if (!isoDateCreated || !isoDateUpdated) {
    return false
  }

  return new Date(isoDateUpdated).getTime() > new Date(isoDateCreated).getTime()
}
