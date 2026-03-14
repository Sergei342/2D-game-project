import { Game, GameEvent, GameCallbacks } from './Game'
import { CANVAS_W } from './types'
import { LEVELS } from './Level'
import type { IAssets } from './Assets'
import type { IPlayer } from '../entities/Player'
import type { FleetShot, FleetHit } from '../entities/Fleet'

const stubCtx = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  drawImage: jest.fn(),
  fillText: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn((w: number, h: number) => ({
    data: new Uint8ClampedArray(w * h * 4),
    width: w,
    height: h,
  })),
  fillStyle: '',
  strokeStyle: '',
  font: '',
  textAlign: '',
  lineWidth: 1,
  globalAlpha: 1,
  imageSmoothingEnabled: true,
  globalCompositeOperation: 'source-over',
} as unknown as CanvasRenderingContext2D

const origCreateElement = document.createElement.bind(document)

beforeAll(() => {
  jest
    .spyOn(document, 'createElement')
    .mockImplementation((tag: string, opts?: any) => {
      if (tag === 'canvas')
        return {
          width: 1,
          height: 1,
          getContext: () => stubCtx,
        } as unknown as HTMLCanvasElement
      return origCreateElement(tag, opts)
    })
})
afterAll(() => jest.restoreAllMocks())

const mkAssets = (allReady = false): IAssets => ({
  loadAll: jest.fn().mockResolvedValue(undefined),
  ready: jest.fn().mockReturnValue(allReady),
  get: jest.fn().mockReturnValue(new Image()),
})

function mkInput() {
  const keys = new Map<string, boolean>()
  return {
    attach: jest.fn(),
    detach: jest.fn(),
    down: jest.fn((c: string) => keys.get(c) ?? false),
    press(code: string, v: boolean) {
      keys.set(code, v)
      ;(this.down as jest.Mock).mockImplementation(
        (c: string) => keys.get(c) ?? false
      )
    },
  }
}

const mkPlayer = (): IPlayer => ({
  x: CANVAS_W / 2 - 28,
  y: 710,
  w: 56,
  h: 56,
  lives: 3,
  score: 0,
  reset: jest.fn(function (this: IPlayer) {
    this.x = CANVAS_W / 2 - 28
    this.y = 710
    this.lives = 3
    this.score = 0
  }),
  update: jest.fn(),
  tryShoot: jest.fn().mockReturnValue(null),
})

function mkFleet() {
  const cfg = {
    aliveCount: 50,
    bottomY: 344,
    shot: null as FleetShot,
    hitResult: null as FleetHit,
    aliveInvaders: [] as any[],
  }
  return {
    cfg,
    resetLevel1Formation: jest.fn(() => {
      cfg.aliveCount = 50
      cfg.bottomY = 344
    }),
    update: jest.fn(),
    setEnemyFireEvery: jest.fn(),
    tryPickShot: jest.fn(() => cfg.shot),
    getAliveCount: jest.fn(() => cfg.aliveCount),
    maxY: jest.fn(() => cfg.bottomY),
    forEachAlive: jest.fn((fn: (inv: any) => void) =>
      cfg.aliveInvaders.forEach(fn)
    ),
    hitTestAndKill: jest.fn(() => cfg.hitResult),
  }
}

function mkGame(ov?: {
  assets?: IAssets
  input?: ReturnType<typeof mkInput>
  player?: IPlayer
  fleet?: ReturnType<typeof mkFleet>
  callbacks?: GameCallbacks
}) {
  const assets = ov?.assets ?? mkAssets()
  const input = ov?.input ?? mkInput()
  const player = ov?.player ?? mkPlayer()
  const fleet = ov?.fleet ?? mkFleet()
  const game = new Game(stubCtx, {
    identity: { userId: 'u1', displayName: 'Tester' },
    callbacks: ov?.callbacks,
    assets,
    input,
    player,
    fleet,
  })
  return { game, assets, input, player, fleet }
}

function collectEvents(cb?: GameCallbacks) {
  const events: GameEvent[] = []
  return {
    events,
    callbacks: {
      ...cb,
      onEvent: (e: GameEvent) => events.push(e),
    } as GameCallbacks,
  }
}

function tick(game: Game, dtMs = 16) {
  let rafCb: FrameRequestCallback | null = null
  const rafSpy = jest
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation(cb => {
      rafCb = cb
      return 1
    })
  const cancelSpy = jest
    .spyOn(window, 'cancelAnimationFrame')
    .mockImplementation(jest.fn())

  game.run()
  if (rafCb) (rafCb as FrameRequestCallback)(0)

  rafCb = null
  rafSpy.mockImplementation(cb => {
    rafCb = cb
    return 2
  })
  if (rafCb) (rafCb as FrameRequestCallback)(dtMs)

  game.stop()
  rafSpy.mockRestore()
  cancelSpy.mockRestore()
}

function placePlayerForEnemyHit(
  player: IPlayer,
  fleet: ReturnType<typeof mkFleet>
) {
  player.x = 200
  player.y = 300
  player.w = 56
  player.h = 56
  fleet.cfg.shot = { x: 220, y: 320 }
}

describe('Game', () => {
  it('initializes with state "start", level 1, fleet configured', () => {
    const { game, fleet } = mkGame()
    expect(game.state).toBe('start')
    expect(game.level.id).toBe(1)
    expect(fleet.resetLevel1Formation).toHaveBeenCalled()
    expect(fleet.setEnemyFireEvery).toHaveBeenCalledWith(
      LEVELS[0].enemyFireEvery
    )
  })

  it('init attaches input and loads assets; destroy detaches', async () => {
    const { game, input, assets } = mkGame()
    await game.init()
    expect(input.attach).toHaveBeenCalled()
    expect(assets.loadAll).toHaveBeenCalled()
    game.destroy()
    expect(input.detach).toHaveBeenCalled()
  })

  it('run is idempotent, stop cancels rAF', () => {
    const rafSpy = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockReturnValue(42)
    const cancelSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(jest.fn())
    const { game } = mkGame()
    game.run()
    game.run()
    expect(rafSpy).toHaveBeenCalledTimes(1)
    game.stop()
    expect(cancelSpy).toHaveBeenCalledWith(42)
    rafSpy.mockRestore()
    cancelSpy.mockRestore()
  })

  it('getSnapshot reflects current state', () => {
    const { game, player } = mkGame()
    player.score = 500
    player.lives = 2
    expect(game.getSnapshot()).toEqual({
      userId: 'u1',
      displayName: 'Tester',
      score: 500,
      lives: 2,
      level: 1,
      state: 'start',
    })
  })

  it('startNewGame transitions to "playing", resets player, emits level', () => {
    const { events, callbacks } = collectEvents()
    const { game, player, fleet } = mkGame({ callbacks })
    game.startNewGame()
    expect(game.state).toBe('playing')
    expect(player.reset).toHaveBeenCalled()
    expect(fleet.resetLevel1Formation).toHaveBeenCalledTimes(2)
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ type: 'level', level: 1 })
  })

  it('restartToStartScreen transitions to "start"', () => {
    const { game, player } = mkGame()
    game.startNewGame()
    game.restartToStartScreen()
    expect(game.state).toBe('start')
    expect(player.reset).toHaveBeenCalled()
  })

  it('handleUiClick ignores null button and misses', () => {
    const { game } = mkGame()
    game.uiButton = null
    game.handleUiClick(400, 400)
    expect(game.state).toBe('start')

    game.uiButton = { x: 100, y: 100, w: 200, h: 50 }
    game.handleUiClick(50, 50)
    expect(game.state).toBe('start')
  })

  it.each([
    ['start', 'playing'],
    ['gameover', 'start'],
    ['win', 'start'],
  ] as const)('button click: "%s" → "%s"', (from, to) => {
    const { game } = mkGame()
    game.uiButton = { x: 100, y: 100, w: 200, h: 50 }
    game.state = from
    game.handleUiClick(150, 120)
    expect(game.state).toBe(to)
  })

  it('button click in "between" → continueNextLevel → "playing" + level event', () => {
    const { events, callbacks } = collectEvents()
    const { game } = mkGame({ callbacks })
    game.uiButton = { x: 100, y: 100, w: 200, h: 50 }
    game.state = 'between'
    game.handleUiClick(150, 120)
    expect(game.state).toBe('playing')
    expect(events.some(e => e.type === 'level')).toBe(true)
  })

  it('continueNextLevel does nothing when state is not "between"', () => {
    const { events, callbacks } = collectEvents()
    const { game } = mkGame({ callbacks })
    game.startNewGame()
    events.length = 0
    game.continueNextLevel()
    expect(game.state).toBe('playing')
    expect(events).toHaveLength(0)
  })

  it('tick in "start" state does not update player', () => {
    const { game, player } = mkGame()
    tick(game, 16)
    expect(player.update).not.toHaveBeenCalled()
  })

  it('player receives moveDir from input', () => {
    const input = mkInput()
    const player = mkPlayer()
    const { game } = mkGame({ input, player })
    game.startNewGame()

    tick(game, 16)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), 0)

    input.press('ArrowLeft', true)
    tick(game, 32)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), -1)

    input.press('ArrowLeft', false)
    input.press('ArrowRight', true)
    tick(game, 48)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), 1)
  })

  it('fleet.tryPickShot spawns enemy bullet that hits player', () => {
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player })

    game.startNewGame()
    placePlayerForEnemyHit(player, fleet)

    tick(game, 16)

    expect(player.lives).toBe(2)
  })

  it('last life lost → gameover with reason "no_lives"', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })

    game.startNewGame()
    player.lives = 1
    placePlayerForEnemyHit(player, fleet)

    tick(game, 16)

    expect(player.lives).toBe(0)
    expect(game.state).toBe('gameover')
    expect(events.find(e => e.type === 'gameover')).toMatchObject({
      reason: 'no_lives',
    })
  })

  it('fleet reaches player zone → gameover with reason "invaders_reached"', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })

    game.startNewGame()
    events.length = 0

    fleet.cfg.bottomY = player.y

    tick(game, 16)

    expect(game.state).toBe('gameover')
    expect(events.find(e => e.type === 'gameover')).toMatchObject({
      reason: 'invaders_reached',
    })
  })

  it('killing invader increases score and emits score event', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()
    ;(player.tryShoot as jest.Mock).mockReturnValueOnce({
      x: 100,
      y: 200,
      w: 4,
      h: 12,
      vy: -760,
      owner: 'player',
      dead: false,
      update: jest.fn(),
      center: () => ({ cx: 102, cy: 206 }),
      isOffscreen: () => false,
    })
    fleet.cfg.hitResult = { scoreGain: 50, x: 95, y: 195, w: 44, h: 34 }

    tick(game, 16)

    expect(player.score).toBe(50)
    expect(events.find(e => e.type === 'score')).toMatchObject({ score: 50 })
  })

  it('accumulates score from multiple kills across ticks', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()

    const mkBullet = () => ({
      x: 100,
      y: 200,
      w: 4,
      h: 12,
      vy: -760,
      owner: 'player' as const,
      dead: false,
      update: jest.fn(),
      center: () => ({ cx: 102, cy: 206 }),
      isOffscreen: () => false,
    })

    ;(player.tryShoot as jest.Mock)
      .mockReturnValueOnce(mkBullet())
      .mockReturnValueOnce(mkBullet())

    let calls = 0
    ;(fleet.hitTestAndKill as jest.Mock).mockImplementation(() =>
      ++calls <= 2 ? { scoreGain: 30, x: 100, y: 200, w: 44, h: 34 } : null
    )

    tick(game, 16)
    tick(game, 32)

    expect(player.score).toBe(60)
    expect(events.filter(e => e.type === 'score')).toHaveLength(2)
  })

  it('clearing wave → "between", grants +1 life, advances level', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()

    fleet.cfg.aliveCount = 0
    tick(game, 16)

    expect(game.state).toBe('between')
    expect(player.lives).toBe(4)
    expect(game.level.id).toBe(2)
    expect(fleet.setEnemyFireEvery).toHaveBeenCalledWith(
      LEVELS[1].enemyFireEvery
    )
  })

  it('completing all levels → "win" with event', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()
    events.length = 0

    for (let i = 0; i < LEVELS.length - 1; i++) {
      fleet.cfg.aliveCount = 0
      tick(game, 16)
      game.continueNextLevel()
      fleet.cfg.aliveCount = 50
    }

    fleet.cfg.aliveCount = 0
    tick(game, 16)

    expect(game.state).toBe('win')
    expect(events.find(e => e.type === 'win')).toMatchObject({ userId: 'u1' })
  })

  it('uiButton is null when "playing", set for other states', () => {
    const { game } = mkGame()
    game.startNewGame()
    tick(game, 16)
    expect(game.uiButton).toBeNull()

    game.state = 'start'
    tick(game, 32)
    expect(game.uiButton).not.toBeNull()
    expect(game.uiButton?.w).toBe(240)
    expect(game.uiButton?.h).toBe(58)
  })

  it('draw does not throw with assets ready or not ready', () => {
    expect(() =>
      tick(mkGame({ assets: mkAssets(true) }).game, 16)
    ).not.toThrow()
    expect(() =>
      tick(mkGame({ assets: mkAssets(false) }).game, 16)
    ).not.toThrow()
  })

  it('works without callbacks and with empty callbacks object', () => {
    expect(() => mkGame().game.startNewGame()).not.toThrow()
    expect(() => mkGame({ callbacks: {} }).game.startNewGame()).not.toThrow()
  })
})
