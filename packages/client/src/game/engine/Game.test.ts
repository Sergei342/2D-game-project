import { Game, GameEvent, GameCallbacks } from './Game'
import { CANVAS_W } from './types'
import { LEVELS } from './Level'
import type { IAssets } from './Assets'
import type { IPlayer } from '../entities/Player'
import type { FleetShot, FleetHit } from '../entities/Fleet'

/** Стандартный шаг одного кадра */
const DT_MS = 16

/** Размер игрока */
const PLAYER_W = 56
const PLAYER_H = 56

/** Половина ширины игрока — смещение от центра холста */
const PLAYER_HALF_W = PLAYER_W / 2

/** Начальная Y-позиция игрока */
const PLAYER_START_Y = 710

/** Начальное количество жизней */
const INITIAL_LIVES = 3

/** Начальное количество живых захватчиков во флоте */
const INITIAL_ALIVE_COUNT = 50

/** Нижняя Y-координата флота по умолчанию */
const INITIAL_FLEET_BOTTOM_Y = 344

/** Размеры кнопки UI */
const UI_BUTTON_X = 100
const UI_BUTTON_Y = 100
const UI_BUTTON_W = 200
const UI_BUTTON_H = 50

/** Координаты клика попадающие внутрь кнопки UI */
const UI_CLICK_HIT_X = 150
const UI_CLICK_HIT_Y = 120

/** Координаты клика промахивающиеся мимо кнопки UI */
const UI_CLICK_MISS_X = 50
const UI_CLICK_MISS_Y = 50

/** Координаты игрока при тесте попадания вражеского выстрела */
const HIT_TEST_PLAYER_X = 200
const HIT_TEST_PLAYER_Y = 300
const HIT_TEST_SHOT_X = 220
const HIT_TEST_SHOT_Y = 320

/** Параметры пули игрока */
const BULLET_X = 100
const BULLET_Y = 200
const BULLET_W = 4
const BULLET_H = 12
const BULLET_VY = -760

/** Параметры убитого захватчика (hitResult) */
const INVADER_HIT_X = 95
const INVADER_HIT_Y = 195
const INVADER_HIT_W = 44
const INVADER_HIT_H = 34

/** Очки за убийство захватчика */
const KILL_SCORE = 50
const KILL_SCORE_MULTI = 30

/** Ожидаемые размеры отрисованной UI-кнопки */
const EXPECTED_UI_BTN_W = 240
const EXPECTED_UI_BTN_H = 58

/** rAF ID, возвращаемый моком */
const RAF_ID = 42

/** Размер stub-канваса */
const STUB_CANVAS_SIZE = 1

/** Размер RGBA данных для getImageData */
const RGBA_CHANNELS = 4

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
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(RGBA_CHANNELS) })),
  putImageData: jest.fn(),
  createImageData: jest.fn((w: number, h: number) => ({
    data: new Uint8ClampedArray(w * h * RGBA_CHANNELS),
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
          width: STUB_CANVAS_SIZE,
          height: STUB_CANVAS_SIZE,
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
  x: CANVAS_W / 2 - PLAYER_HALF_W,
  y: PLAYER_START_Y,
  w: PLAYER_W,
  h: PLAYER_H,
  lives: INITIAL_LIVES,
  score: 0,
  reset: jest.fn(function (this: IPlayer) {
    this.x = CANVAS_W / 2 - PLAYER_HALF_W
    this.y = PLAYER_START_Y
    this.lives = INITIAL_LIVES
    this.score = 0
  }),
  update: jest.fn(),
  tryShoot: jest.fn().mockReturnValue(null),
})

function mkFleet() {
  const cfg = {
    aliveCount: INITIAL_ALIVE_COUNT,
    bottomY: INITIAL_FLEET_BOTTOM_Y,
    shot: null as FleetShot,
    hitResult: null as FleetHit,
    aliveInvaders: [] as any[],
  }
  return {
    cfg,
    resetLevel1Formation: jest.fn(() => {
      cfg.aliveCount = INITIAL_ALIVE_COUNT
      cfg.bottomY = INITIAL_FLEET_BOTTOM_Y
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

function tick(game: Game, dtMs = DT_MS) {
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

function mkUiButton() {
  return { x: UI_BUTTON_X, y: UI_BUTTON_Y, w: UI_BUTTON_W, h: UI_BUTTON_H }
}

function placePlayerForEnemyHit(
  player: IPlayer,
  fleet: ReturnType<typeof mkFleet>
) {
  player.x = HIT_TEST_PLAYER_X
  player.y = HIT_TEST_PLAYER_Y
  player.w = PLAYER_W
  player.h = PLAYER_H
  fleet.cfg.shot = { x: HIT_TEST_SHOT_X, y: HIT_TEST_SHOT_Y }
}

function mkBullet() {
  return {
    x: BULLET_X,
    y: BULLET_Y,
    w: BULLET_W,
    h: BULLET_H,
    vy: BULLET_VY,
    owner: 'player' as const,
    dead: false,
    update: jest.fn(),
    center: () => ({
      cx: BULLET_X + BULLET_W / 2,
      cy: BULLET_Y + BULLET_H / 2,
    }),
    isOffscreen: () => false,
  }
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
      .mockReturnValue(RAF_ID)
    const cancelSpy = jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(jest.fn())
    const { game } = mkGame()
    game.run()
    game.run()
    expect(rafSpy).toHaveBeenCalledTimes(1)
    game.stop()
    expect(cancelSpy).toHaveBeenCalledWith(RAF_ID)
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
    game.handleUiClick(UI_CLICK_HIT_X, UI_CLICK_HIT_Y)
    expect(game.state).toBe('start')

    game.uiButton = mkUiButton()
    game.handleUiClick(UI_CLICK_MISS_X, UI_CLICK_MISS_Y)
    expect(game.state).toBe('start')
  })

  it.each([
    ['start', 'playing'],
    ['gameover', 'start'],
    ['win', 'start'],
  ] as const)('button click: "%s" → "%s"', (from, to) => {
    const { game } = mkGame()
    game.uiButton = mkUiButton()
    game.state = from
    game.handleUiClick(UI_CLICK_HIT_X, UI_CLICK_HIT_Y)
    expect(game.state).toBe(to)
  })

  it('button click in "between" → continueNextLevel → "playing" + level event', () => {
    const { events, callbacks } = collectEvents()
    const { game } = mkGame({ callbacks })
    game.uiButton = mkUiButton()
    game.state = 'between'
    game.handleUiClick(UI_CLICK_HIT_X, UI_CLICK_HIT_Y)
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
    tick(game)
    expect(player.update).not.toHaveBeenCalled()
  })

  it('player receives moveDir from input', () => {
    const input = mkInput()
    const player = mkPlayer()
    const { game } = mkGame({ input, player })
    game.startNewGame()

    tick(game)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), 0)

    input.press('ArrowLeft', true)
    tick(game, DT_MS * 2)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), -1)

    input.press('ArrowLeft', false)
    input.press('ArrowRight', true)
    tick(game, DT_MS * 3)
    expect(player.update).toHaveBeenCalledWith(expect.any(Number), 1)
  })

  it('fleet.tryPickShot spawns enemy bullet that hits player', () => {
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player })

    game.startNewGame()
    placePlayerForEnemyHit(player, fleet)

    tick(game)

    expect(player.lives).toBe(INITIAL_LIVES - 1)
  })

  it('last life lost → gameover with reason "no_lives"', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })

    game.startNewGame()
    player.lives = 1
    placePlayerForEnemyHit(player, fleet)

    tick(game)

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

    tick(game)

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
    ;(player.tryShoot as jest.Mock).mockReturnValueOnce(mkBullet())
    fleet.cfg.hitResult = {
      scoreGain: KILL_SCORE,
      x: INVADER_HIT_X,
      y: INVADER_HIT_Y,
      w: INVADER_HIT_W,
      h: INVADER_HIT_H,
    }

    tick(game)

    expect(player.score).toBe(KILL_SCORE)
    expect(events.find(e => e.type === 'score')).toMatchObject({
      score: KILL_SCORE,
    })
  })

  it('accumulates score from multiple kills across ticks', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()
    ;(player.tryShoot as jest.Mock)
      .mockReturnValueOnce(mkBullet())
      .mockReturnValueOnce(mkBullet())

    let calls = 0
    ;(fleet.hitTestAndKill as jest.Mock).mockImplementation(() =>
      ++calls <= 2
        ? {
            scoreGain: KILL_SCORE_MULTI,
            x: BULLET_X,
            y: BULLET_Y,
            w: INVADER_HIT_W,
            h: INVADER_HIT_H,
          }
        : null
    )

    tick(game)
    tick(game, DT_MS * 2)

    expect(player.score).toBe(KILL_SCORE_MULTI * 2)
    expect(events.filter(e => e.type === 'score')).toHaveLength(2)
  })

  it('clearing wave → "between", grants +1 life, advances level', () => {
    const { events, callbacks } = collectEvents()
    const fleet = mkFleet()
    const player = mkPlayer()
    const { game } = mkGame({ fleet, player, callbacks })
    game.startNewGame()

    fleet.cfg.aliveCount = 0
    tick(game)

    expect(game.state).toBe('between')
    expect(player.lives).toBe(INITIAL_LIVES + 1)
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
      tick(game)
      game.continueNextLevel()
      fleet.cfg.aliveCount = INITIAL_ALIVE_COUNT
    }

    fleet.cfg.aliveCount = 0
    tick(game)

    expect(game.state).toBe('win')
    expect(events.find(e => e.type === 'win')).toMatchObject({ userId: 'u1' })
  })

  it('uiButton is null when "playing", set for other states', () => {
    const { game } = mkGame()
    game.startNewGame()
    tick(game)
    expect(game.uiButton).toBeNull()

    game.state = 'start'
    tick(game, DT_MS * 2)
    expect(game.uiButton).not.toBeNull()
    expect(game.uiButton?.w).toBe(EXPECTED_UI_BTN_W)
    expect(game.uiButton?.h).toBe(EXPECTED_UI_BTN_H)
  })

  it('draw does not throw with assets ready or not ready', () => {
    expect(() => tick(mkGame({ assets: mkAssets(true) }).game)).not.toThrow()
    expect(() => tick(mkGame({ assets: mkAssets(false) }).game)).not.toThrow()
  })

  it('works without callbacks and with empty callbacks object', () => {
    expect(() => mkGame().game.startNewGame()).not.toThrow()
    expect(() => mkGame({ callbacks: {} }).game.startNewGame()).not.toThrow()
  })
})
