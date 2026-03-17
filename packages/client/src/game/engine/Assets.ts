export type AssetKey =
  | 'bg'
  | 'player'
  | 'invader'
  | 'bullet'
  | 'enemyBullet'
  | 'explosion'
  | 'shield'

export type AssetSources = Readonly<Record<AssetKey, string>>

export interface IAssets {
  loadAll(): Promise<void>
  ready(key: AssetKey): boolean
  get(key: AssetKey): HTMLImageElement
}

export const DEFAULT_SOURCES: AssetSources = {
  bg: '/game-graphic/space.webp',
  player: '/game-graphic/space-invader.webp',
  invader: '/game-graphic/space-enemy.webp',
  bullet: '/game-graphic/space-bullet.webp',
  enemyBullet: '/game-graphic/enemy-bullet.webp',
  explosion: '/game-graphic/explosion.webp',
  shield: '/game-graphic/space-shield.webp',
}

export class Assets implements IAssets {
  private readonly images: Record<AssetKey, HTMLImageElement>
  private readonly sources: AssetSources

  constructor(sources: Partial<AssetSources> = {}) {
    this.sources = { ...DEFAULT_SOURCES, ...sources }

    this.images = {
      bg: new Image(),
      player: new Image(),
      invader: new Image(),
      bullet: new Image(),
      enemyBullet: new Image(),
      explosion: new Image(),
      shield: new Image(),
    }
    ;(Object.keys(this.images) as AssetKey[]).forEach(k => {
      this.images[k].src = this.sources[k]
    })
  }

  get(key: AssetKey) {
    return this.images[key]
  }

  ready(key: AssetKey) {
    const img = this.images[key]
    return img.complete && img.naturalWidth > 0
  }

  async loadAll() {
    const keys = Object.keys(this.images) as AssetKey[]
    await Promise.all(
      keys.map(
        k =>
          new Promise<void>(resolve => {
            const img = this.images[k]
            if (img.complete && img.naturalWidth > 0) return resolve()
            img.onload = () => resolve()
            img.onerror = () => resolve() // с fallback-отрисовкой
          })
      )
    )
  }
}
