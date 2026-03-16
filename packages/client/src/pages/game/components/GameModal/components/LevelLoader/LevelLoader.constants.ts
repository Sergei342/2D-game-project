export const LOADING_PHRASES_MAP = {
  refuel: 'Заправляем корабль',
  ammo: 'Пополняем боекомплект',
  helmet: 'Надеваем шлем',
} as const

export type LoadingPhrase =
  typeof LOADING_PHRASES_MAP[keyof typeof LOADING_PHRASES_MAP]

export const LOADING_PHRASES: LoadingPhrase[] =
  Object.values(LOADING_PHRASES_MAP)

export const LOADING_DELAY = 1000
