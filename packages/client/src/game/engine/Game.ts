import type { IAssets } from './Assets'
import { Assets } from './Assets'
import type { IInput } from './Input'
import { Input } from './Input'
import { CANVAS_H, CANVAS_W, type GameState, intersectsRect } from './types'
import { LEVELS, type LevelConfig, type LevelId } from './Level'

import type { IPlayer } from '../entities/Player'
import { Player } from '../entities/Player'

import type { IFleet } from '../entities/Fleet'
import { Fleet } from '../entities/Fleet'

import { Bullet } from '../entities/Bullet'
import { Shield } from '../entities/Shield'
import { Explosion } from '../entities/Explosion'

export type PlayerIdentity = {
  userId: string
  displayName?: string
}

export type GameEvent =
  | { type: 'score'; userId: string; score: number; level: LevelId; at: number }
  | { type: 'level'; userId: string; level: LevelId; at: number }
  | {
      type: 'gameover'
      userId: string
      score: number
      level: LevelId
      at: number
      reason: 'no_lives' | 'invaders_reached'
    }
  | { type: 'win'; userId: string; score: number; level: LevelId; at: number }

export type GameCallbacks = {
  onEvent?: (e: GameEvent) => void
}

export class Game {
  private readonly ctx: CanvasRenderingContext2D

  private rafId: number | null = null
  private lastT = 0
  private running = false

  private readonly assets: IAssets
  private readonly input: IInput
  private readonly player: IPlayer
  private readonly fleet: IFleet

  private readonly identity: PlayerIdentity
  private readonly callbacks?: GameCallbacks

  state: GameState = 'start'
  uiButton: { x: number; y: number; w: number; h: number } | null = null

  private levelIndex = 0
  private bullets: Bullet[] = []
  private shields: Shield[] = []
  private explosions: Explosion[] = []

  constructor(
    ctx: CanvasRenderingContext2D,
    opts: {
      identity: PlayerIdentity
      callbacks?: GameCallbacks

      assets?: IAssets
      input?: IInput
      player?: IPlayer
      fleet?: IFleet
    }
  ) {
    this.ctx = ctx

    this.identity = opts.identity
    this.callbacks = opts.callbacks

    this.assets = opts.assets ?? new Assets()
    this.input = opts.input ?? new Input()
    this.player = opts.player ?? new Player()
    this.fleet = opts.fleet ?? new Fleet()

    this.fleet.resetLevel1Formation()
    this.applyLevelConfig(this.level)
  }

  get level(): LevelConfig {
    return LEVELS[this.levelIndex]
  }

  async init() {
    this.input.attach()
    await this.assets.loadAll()
    // shields bake зависит от ассетов — если стартуем сразу, всё ок.
  }

  destroy() {
    this.stop()
    this.input.detach()
  }

  run() {
    if (this.running) return // важно для React StrictMode
    this.running = true

    const loop = (t: number) => {
      if (!this.lastT) this.lastT = t
      const dt = Math.min(0.033, (t - this.lastT) / 1000)
      this.lastT = t

      this.update(dt)
      this.draw()

      this.rafId = requestAnimationFrame(loop)
    }

    this.rafId = requestAnimationFrame(loop)
  }

  stop() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.running = false
  }

  startNewGame() {
    this.player.reset()
    this.levelIndex = 0
    this.state = 'playing'

    this.resetWorldForCurrentLevel()

    this.emit({
      type: 'level',
      userId: this.identity.userId,
      level: this.level.id,
      at: Date.now(),
    })
  }

  restartToStartScreen() {
    this.state = 'start'
    this.player.reset()
    this.levelIndex = 0
    this.bullets = []
    this.shields = []
    this.fleet.resetLevel1Formation()
    this.applyLevelConfig(this.level)
  }

  continueNextLevel() {
    if (this.state !== 'between') return
    this.state = 'playing'
    this.emit({
      type: 'level',
      userId: this.identity.userId,
      level: this.level.id,
      at: Date.now(),
    })
  }

  handleUiClick(worldX: number, worldY: number) {
    if (!this.uiButton) return
    const b = this.uiButton
    const inside =
      worldX >= b.x &&
      worldX <= b.x + b.w &&
      worldY >= b.y &&
      worldY <= b.y + b.h
    if (!inside) return

    if (this.state === 'start') this.startNewGame()
    else if (this.state === 'between') this.continueNextLevel()
    else if (this.state === 'gameover' || this.state === 'win')
      this.restartToStartScreen()
  }

  // полезно для лидерборда - polling
  getSnapshot() {
    return {
      userId: this.identity.userId,
      displayName: this.identity.displayName,
      score: this.player.score,
      lives: this.player.lives,
      level: this.level.id,
      state: this.state,
    }
  }

  private emit(e: GameEvent) {
    this.callbacks?.onEvent?.(e)
  }

  private applyLevelConfig(level: LevelConfig) {
    this.fleet.setEnemyFireEvery(level.enemyFireEvery)
  }

  private resetWorldForCurrentLevel() {
    this.bullets = []
    this.fleet.resetLevel1Formation()
    this.applyLevelConfig(this.level)
    this.explosions = []

    // shields
    this.shields = this.level.shields.map(s => new Shield(s.x, s.y, s.w, s.h))

    if (this.shields.length > 0) {
      if (this.assets.ready('shield')) {
        const img = this.assets.get('shield')
        for (const sh of this.shields) sh.bakeFromImage(img)
      } else {
        for (const sh of this.shields) sh.bakeFallback()
      }
    }
  }

  private update(dt: number) {
    if (this.state !== 'playing') return

    // moveDir без кастов
    const moveDir: -1 | 0 | 1 = this.input.down('ArrowLeft')
      ? -1
      : this.input.down('ArrowRight')
      ? 1
      : 0

    this.player.update(dt, moveDir)

    const shot = this.player.tryShoot(this.input.down('Space'))
    if (shot) this.bullets.push(shot)

    this.fleet.update(dt)

    const enemyShot = this.fleet.tryPickShot(dt)
    if (enemyShot) {
      this.bullets.push(
        new Bullet({ x: enemyShot.x, y: enemyShot.y, vy: 420, owner: 'enemy' })
      )
    }

    // update bullets
    for (const b of this.bullets) b.update(dt)

    // update взрыва
    for (const ex of this.explosions) ex.update(dt)
    this.explosions = this.explosions.filter(ex => !ex.dead)

    // collisions set dead=true
    this.resolveCollisions()

    // sweep bullets once (без splice в боевой логике)
    this.bullets = this.bullets.filter(b => !b.dead && !b.isOffscreen(CANVAS_H))

    // lose: invaders reached player zone
    if (this.fleet.maxY() >= this.player.y - 12) {
      this.state = 'gameover'
      this.emit({
        type: 'gameover',
        userId: this.identity.userId,
        score: this.player.score,
        level: this.level.id,
        at: Date.now(),
        reason: 'invaders_reached',
      })
      return
    }

    // win wave -> next level or win
    if (this.fleet.getAliveCount() === 0) {
      if (this.levelIndex < LEVELS.length - 1) {
        this.levelIndex++

        // +1 жизнь за достижение нового уровня (2 и 3)
        this.player.lives += 1

        this.resetWorldForCurrentLevel()
        this.state = 'between'
      } else {
        this.state = 'win'
        this.emit({
          type: 'win',
          userId: this.identity.userId,
          score: this.player.score,
          level: this.level.id,
          at: Date.now(),
        })
      }
    }
  }

  private resolveCollisions() {
    // 1) bullets vs shields
    if (this.shields.length > 0) {
      for (const b of this.bullets) {
        if (b.dead) continue

        // быстрый bbox + пиксельная альфа проверка
        const { cx, cy } = b.center()

        for (const sh of this.shields) {
          if (!intersectsRect(b, sh)) continue
          if (!sh.hasPixelAt(cx, cy)) continue

          sh.damageAt(cx, cy, 11)
          b.dead = true
          break
        }
      }
    }

    // 2) player bullets vs invaders (инкапсулировано в Fleet)
    for (const b of this.bullets) {
      if (b.dead || b.owner !== 'player') continue

      const hit = this.fleet.hitTestAndKill(b)
      if (hit) {
        b.dead = true

        this.player.score += hit.scoreGain

        // спавн взрыва в центре врага
        const exX = hit.x + hit.w / 2
        const exY = hit.y + hit.h / 2
        this.explosions.push(new Explosion(exX, exY, { ttl: 0.22, size: 64 }))

        this.emit({
          type: 'score',
          userId: this.identity.userId,
          score: this.player.score,
          level: this.level.id,
          at: Date.now(),
        })
      }
    }

    // 3) enemy bullets vs player
    for (const b of this.bullets) {
      if (b.dead || b.owner !== 'enemy') continue

      if (intersectsRect(b, this.player)) {
        b.dead = true
        this.player.lives -= 1

        if (this.player.lives <= 0) {
          this.state = 'gameover'
          this.emit({
            type: 'gameover',
            userId: this.identity.userId,
            score: this.player.score,
            level: this.level.id,
            at: Date.now(),
            reason: 'no_lives',
          })
          return
        }
      }
    }
  }

  private draw() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

    // background
    if (this.assets.ready('bg'))
      ctx.drawImage(this.assets.get('bg'), 0, 0, CANVAS_W, CANVAS_H)
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
    ctx.fillText(`Level: ${this.level.id}`, 170, 32)
    ctx.textAlign = 'right'
    ctx.fillText(`Lives: ${this.player.lives}`, CANVAS_W - 16, 32)

    // invaders
    if (this.assets.ready('invader')) {
      const img = this.assets.get('invader')
      this.fleet.forEachAlive(inv => {
        ctx.drawImage(img, inv.x, inv.y, inv.w, inv.h)
      })
    } else {
      ctx.fillStyle = '#6dff7a'
      this.fleet.forEachAlive(inv => {
        ctx.fillRect(inv.x, inv.y, inv.w, inv.h)
      })
    }

    // shields
    for (const sh of this.shields) sh.draw(ctx)

    // bullets
    for (const b of this.bullets) {
      if (b.owner === 'player') {
        if (this.assets.ready('bullet')) {
          ctx.drawImage(
            this.assets.get('bullet'),
            b.x - 4,
            b.y - 6,
            b.w + 8,
            b.h + 12
          )
        } else {
          ctx.fillStyle = '#fff'
          ctx.fillRect(b.x, b.y, b.w, b.h)
        }
      } else {
        if (this.assets.ready('enemyBullet')) {
          ctx.drawImage(
            this.assets.get('enemyBullet'),
            b.x - 4,
            b.y - 6,
            b.w + 8,
            b.h + 12
          )
        } else {
          ctx.fillStyle = '#ff6b6b'
          ctx.fillRect(b.x, b.y, b.w, b.h)
        }
      }
    }

    // player
    if (this.assets.ready('player')) {
      ctx.drawImage(
        this.assets.get('player'),
        this.player.x,
        this.player.y,
        this.player.w,
        this.player.h
      )
    } else {
      ctx.fillStyle = '#66b3ff'
      ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h)
    }

    // взрывы
    for (const ex of this.explosions) {
      const size = ex.size
      const x = ex.x - size / 2
      const y = ex.y - size / 2

      this.ctx.save()
      this.ctx.globalAlpha = ex.alpha

      if (this.assets.ready('explosion')) {
        this.ctx.imageSmoothingEnabled = false
        this.ctx.drawImage(this.assets.get('explosion'), x, y, size, size)
      } else {
        // fallback
        this.ctx.fillStyle = 'rgba(255, 210, 90, 0.9)'
        this.ctx.beginPath()
        this.ctx.arc(ex.x, ex.y, size * 0.25, 0, Math.PI * 2)
        this.ctx.fill()
      }

      this.ctx.restore()
    }

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
        : this.state === 'between'
        ? `LEVEL ${this.level.id}`
        : this.state === 'win'
        ? 'YOU WIN!'
        : 'GAME OVER'

    ctx.fillText(title, CANVAS_W / 2, CANVAS_H / 2 - 90)

    ctx.font = '16px monospace, Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.fillText('←/→ move   Space shoot', CANVAS_W / 2, CANVAS_H / 2 - 48)

    const btnW = 240
    const btnH = 58
    const btnX = CANVAS_W / 2 - btnW / 2
    const btnY = CANVAS_H / 2 + 10

    this.uiButton = { x: btnX, y: btnY, w: btnW, h: btnH }

    ctx.fillStyle = this.state === 'gameover' ? '#ff5a5a' : '#65d96e'
    ctx.fillRect(btnX, btnY, btnW, btnH)

    ctx.fillStyle = '#071018'
    ctx.font = 'bold 24px monospace, Arial, sans-serif'

    const btnText =
      this.state === 'start'
        ? 'START'
        : this.state === 'between'
        ? 'CONTINUE'
        : 'RESTART'

    ctx.fillText(btnText, CANVAS_W / 2, btnY + 38)

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
