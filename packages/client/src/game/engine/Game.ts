import { Assets } from './Assets'
import { CANVAS_H, CANVAS_W, GameState, aabb } from './types'
import { Input } from './Input'
import { Player } from '../entities/Player'
import { Fleet } from '../entities/Fleet'
import { Bullet } from '../entities/Bullet'

export class Game {
  private ctx: CanvasRenderingContext2D
  private raf = 0
  private lastT = 0

  state: GameState = 'start'
  uiButton: { x: number; y: number; w: number; h: number } | null = null

  readonly assets = new Assets()
  readonly input = new Input()

  readonly player = new Player()
  readonly fleet = new Fleet()
  bullets: Bullet[] = []

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
    this.assets.setSources()
    this.fleet.resetLevel1()
  }

  async init() {
    this.input.attach()
    await this.assets.loadAll()
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.input.detach()
  }

  start() {
    this.state = 'playing'
    this.player.reset()
    this.fleet.resetLevel1()
    this.bullets = []
  }

  restart() {
    this.state = 'start'
    this.player.reset()
    this.fleet.resetLevel1()
    this.bullets = []
  }

  handleCanvasClick(x: number, y: number) {
    if (!this.uiButton) return
    const b = this.uiButton
    const inside = x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h
    if (!inside) return

    if (this.state === 'start') this.start()
    else if (this.state === 'gameover' || this.state === 'win') this.restart()
  }

  run() {
    const loop = (t: number) => {
      if (!this.lastT) this.lastT = t
      const dt = Math.min(0.033, (t - this.lastT) / 1000)
      this.lastT = t

      this.update(dt)
      this.draw()

      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  private update(dt: number) {
    if (this.state !== 'playing') return

    // input
    const moveDir: -1 | 0 | 1 = ((this.input.down('ArrowLeft') ? -1 : 0) +
      (this.input.down('ArrowRight') ? 1 : 0)) as -1 | 0 | 1

    this.player.update(dt, moveDir)

    const shot = this.player.tryShoot(this.input.down('Space'))
    if (shot) this.bullets.push(shot)

    // fleet
    this.fleet.update(dt)

    // enemy fire
    const shooter = this.fleet.pickShooter(dt)
    if (shooter) {
      this.bullets.push(
        new Bullet({
          x: shooter.x + shooter.w / 2 - 3,
          y: shooter.y + shooter.h + 6,
          vy: 420,
          owner: 'enemy',
        })
      )
    }

    // bullets update + cull
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]
      b.update(dt)
      if (b.isOffscreen(CANVAS_H)) this.bullets.splice(i, 1)
    }

    // collisions
    this.resolveCollisions()

    // lose condition: invaders reached player zone
    if (this.fleet.maxY() >= this.player.y - 12) {
      this.state = 'gameover'
      return
    }

    // win condition
    if (this.fleet.alive().length === 0) {
      this.state = 'win'
    }
  }

  private resolveCollisions() {
    // player bullets vs invaders
    const alive = this.fleet.invaders

    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const b = this.bullets[bi]
      if (b.owner !== 'player') continue

      let hit = false
      for (const inv of alive) {
        if (!inv.alive) continue
        if (aabb(b, inv)) {
          inv.alive = false
          this.player.score += inv.score
          hit = true
          break
        }
      }
      if (hit) this.bullets.splice(bi, 1)
    }

    // enemy bullets vs player
    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const b = this.bullets[bi]
      if (b.owner !== 'enemy') continue

      if (aabb(b, this.player)) {
        this.bullets.splice(bi, 1)
        this.player.lives -= 1
        if (this.player.lives <= 0) this.state = 'gameover'
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // background
    if (this.assets.ready('bg'))
      ctx.drawImage(this.assets.images.bg, 0, 0, CANVAS_W, CANVAS_H)
    else {
      ctx.fillStyle = '#050714'
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    }

    // HUD
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, CANVAS_W, 52)
    ctx.fillStyle = '#d7f5ff'
    ctx.font = 'bold 18px monospace, Arial, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Score: ${this.player.score}`, 16, 32)
    ctx.textAlign = 'right'
    ctx.fillText(`Lives: ${this.player.lives}`, CANVAS_W - 16, 32)

    // invaders
    for (const inv of this.fleet.invaders) {
      if (!inv.alive) continue
      if (this.assets.ready('invader'))
        ctx.drawImage(this.assets.images.invader, inv.x, inv.y, inv.w, inv.h)
      else {
        ctx.fillStyle = '#6dff7a'
        ctx.fillRect(inv.x, inv.y, inv.w, inv.h)
      }
    }

    // bullets
    for (const b of this.bullets) {
      if (b.owner === 'player') {
        if (this.assets.ready('bullet'))
          ctx.drawImage(
            this.assets.images.bullet,
            b.x - 4,
            b.y - 6,
            b.w + 8,
            b.h + 12
          )
        else {
          ctx.fillStyle = '#fff'
          ctx.fillRect(b.x, b.y, b.w, b.h)
        }
      } else {
        if (this.assets.ready('enemyBullet'))
          ctx.drawImage(
            this.assets.images.enemyBullet,
            b.x - 4,
            b.y - 6,
            b.w + 8,
            b.h + 12
          )
        else {
          ctx.fillStyle = '#ff6b6b'
          ctx.fillRect(b.x, b.y, b.w, b.h)
        }
      }
    }

    // player
    if (this.assets.ready('player'))
      ctx.drawImage(
        this.assets.images.player,
        this.player.x,
        this.player.y,
        this.player.w,
        this.player.h
      )
    else {
      ctx.fillStyle = '#66b3ff'
      ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h)
    }

    // overlay screens
    this.drawOverlay()
    this.drawBorder()
  }

  private drawOverlay() {
    const ctx = this.ctx

    if (this.state === 'playing') {
      this.uiButton = null
      return
    }

    ctx.fillStyle = 'rgba(0,0,0,0.72)'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 40px monospace, Arial, sans-serif'

    const title =
      this.state === 'start'
        ? 'SPACE INVADERS'
        : this.state === 'win'
        ? 'YOU WIN!'
        : 'GAME OVER'
    ctx.fillText(title, CANVAS_W / 2, CANVAS_H / 2 - 90)

    ctx.font = '16px monospace, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText('←/→ move   Space shoot', CANVAS_W / 2, CANVAS_H / 2 - 48)

    const btnW = 240,
      btnH = 58
    const btnX = CANVAS_W / 2 - btnW / 2
    const btnY = CANVAS_H / 2 + 10
    this.uiButton = { x: btnX, y: btnY, w: btnW, h: btnH }

    ctx.fillStyle = this.state === 'gameover' ? '#ff5a5a' : '#65d96e'
    ctx.fillRect(btnX, btnY, btnW, btnH)

    ctx.fillStyle = '#071018'
    ctx.font = 'bold 24px monospace, Arial, sans-serif'
    ctx.fillText(
      this.state === 'start' ? 'START' : 'RESTART',
      CANVAS_W / 2,
      btnY + 38
    )

    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = '16px monospace, Arial, sans-serif'
    ctx.fillText(`Score: ${this.player.score}`, CANVAS_W / 2, btnY + 92)
  }

  private drawBorder() {
    const ctx = this.ctx
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, CANVAS_W - 2, CANVAS_H - 2)
  }
}
