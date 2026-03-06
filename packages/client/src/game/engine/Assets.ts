export type AssetKey =
  | 'bg'
  | 'player'
  | 'invader'
  | 'bullet'
  | 'enemyBullet'
  | 'explosion'

export class Assets {
  images: Record<AssetKey, HTMLImageElement> = {
    bg: new Image(),
    player: new Image(),
    invader: new Image(),
    bullet: new Image(),
    enemyBullet: new Image(),
    explosion: new Image(),
  }

  // под будущую груфику
  setSources() {
    this.images.bg.src = ''
    this.images.player.src = ''
    this.images.invader.src = ''
    this.images.bullet.src = ''
    this.images.enemyBullet.src = ''
    this.images.explosion.src = ''
  }

  async loadAll() {
    const entries = Object.values(this.images)

    await Promise.all(
      entries.map(
        img =>
          new Promise<void>(resolve => {
            if (img.complete && img.naturalWidth > 0) return resolve()
            img.onload = () => resolve()
            img.onerror = () => resolve() // fallback рисование всё равно будет
          })
      )
    )
  }

  ready(key: AssetKey) {
    const img = this.images[key]
    return img.complete && img.naturalWidth > 0
  }
}
