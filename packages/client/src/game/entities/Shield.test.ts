import { Shield } from './Shield'

function createStubCtx(): Record<string, unknown> {
  const state = {
    globalCompositeOperation: 'source-over',
    fillStyle: '',
    imageSmoothingEnabled: true,
  }

  const stateStack: typeof state[] = []
  let pixelAlpha = 0

  const ctx: Record<string, unknown> = {
    ...state,

    clearRect: jest.fn(() => {
      pixelAlpha = 0
    }),

    fillRect: jest.fn(() => {
      if (ctx.globalCompositeOperation === DEST_OUT) {
        pixelAlpha = 0
      } else {
        pixelAlpha = 242
      }
    }),

    drawImage: jest.fn(() => {
      pixelAlpha = 255
    }),

    beginPath: jest.fn(),

    arc: jest.fn(),

    fill: jest.fn(() => {
      if (ctx.globalCompositeOperation === DEST_OUT) {
        pixelAlpha = 0
      } else {
        pixelAlpha = 242
      }
    }),

    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray([0, 0, 0, pixelAlpha]),
    })),

    save: jest.fn(() => {
      stateStack.push({
        globalCompositeOperation: ctx.globalCompositeOperation as string,
        fillStyle: ctx.fillStyle as string,
        imageSmoothingEnabled: ctx.imageSmoothingEnabled as boolean,
      })
    }),

    restore: jest.fn(() => {
      const prev = stateStack.pop()
      if (prev) Object.assign(ctx, prev)
    }),
  }

  return ctx
}

function createStubCanvas(stubCtx: Record<string, unknown>) {
  return {
    width: 1,
    height: 1,
    getContext: jest.fn(() => stubCtx),
  }
}

const DEST_OUT = 'destination-out'

let lastStubCtx: Record<string, unknown>
const origCreateElement = document.createElement.bind(document)

beforeEach(() => {
  lastStubCtx = createStubCtx()
  jest
    .spyOn(document, 'createElement')
    .mockImplementation((tag: string, options?: ElementCreationOptions) => {
      if (tag === 'canvas')
        return createStubCanvas(lastStubCtx) as unknown as HTMLCanvasElement
      return origCreateElement(tag, options)
    })
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Shield — constructor', () => {
  it('sets x, y, w, h', () => {
    const s = new Shield(10, 20, 80, 60)
    expect(s.x).toBe(10)
    expect(s.y).toBe(20)
    expect(s.w).toBe(80)
    expect(s.h).toBe(60)
  })

  it('does not throw for sub-pixel dimensions', () => {
    expect(() => new Shield(0, 0, 0.3, 0.7)).not.toThrow()
  })
})

describe('Shield — bakeFallback', () => {
  it('calls clearRect 3 times: full clear + two windows', () => {
    const s = new Shield(0, 0, 100, 100)
    s.bakeFallback()
    expect((lastStubCtx.clearRect as jest.Mock).mock.calls).toHaveLength(3)
  })

  it('first clearRect starts at 0,0', () => {
    const s = new Shield(0, 0, 40, 30)
    s.bakeFallback()
    const firstCall = (lastStubCtx.clearRect as jest.Mock).mock.calls[0]
    expect(firstCall[0]).toBe(0)
    expect(firstCall[1]).toBe(0)
  })

  it('calls fillRect', () => {
    const s = new Shield(0, 0, 40, 30)
    s.bakeFallback()
    expect(lastStubCtx.fillRect as jest.Mock).toHaveBeenCalled()
  })
})

describe('Shield — bakeFromImage', () => {
  it('clears buffer, disables smoothing and draws image', () => {
    const s = new Shield(0, 0, 50, 60)
    const fakeImg = { width: 50, height: 60 } as HTMLImageElement

    s.bakeFromImage(fakeImg)

    expect(lastStubCtx.clearRect as jest.Mock).toHaveBeenCalledWith(
      0,
      0,
      expect.any(Number),
      expect.any(Number)
    )
    expect(lastStubCtx.imageSmoothingEnabled).toBe(false)
    expect(lastStubCtx.drawImage as jest.Mock).toHaveBeenCalledWith(
      fakeImg,
      0,
      0,
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('calls drawImage exactly once', () => {
    const s = new Shield(0, 0, 40, 40)
    s.bakeFromImage({ width: 40, height: 40 } as HTMLImageElement)
    expect((lastStubCtx.drawImage as jest.Mock).mock.calls).toHaveLength(1)
  })
})

describe('Shield — hasPixelAt', () => {
  it('returns false for coordinates outside bounds', () => {
    const s = new Shield(100, 100, 40, 30)
    expect(s.hasPixelAt(50, 50)).toBe(false)
    expect(s.hasPixelAt(200, 200)).toBe(false)
    expect(lastStubCtx.getImageData as jest.Mock).not.toHaveBeenCalled()
  })

  it('calls getImageData for coordinates inside bounds', () => {
    const s = new Shield(0, 0, 40, 30)
    s.hasPixelAt(20, 15)
    expect(lastStubCtx.getImageData as jest.Mock).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      1,
      1
    )
  })

  it('returns false when buffer is empty', () => {
    const s = new Shield(0, 0, 40, 30)
    expect(s.hasPixelAt(1, 1)).toBe(false)
  })

  it('returns true after bakeFromImage', () => {
    const s = new Shield(0, 0, 40, 40)
    s.bakeFromImage({ width: 40, height: 40 } as HTMLImageElement)
    expect(s.hasPixelAt(20, 20)).toBe(true)
  })
})

describe('Shield — damageAt', () => {
  it('uses save/restore and destination-out with arc', () => {
    const s = new Shield(0, 0, 60, 60)
    s.bakeFallback()
    s.damageAt(30, 30, 20)

    expect(lastStubCtx.save as jest.Mock).toHaveBeenCalled()
    expect(lastStubCtx.beginPath as jest.Mock).toHaveBeenCalled()
    expect(lastStubCtx.arc as jest.Mock).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
      0,
      Math.PI * 2
    )
    expect(lastStubCtx.fill as jest.Mock).toHaveBeenCalled()
    expect(lastStubCtx.restore as jest.Mock).toHaveBeenCalled()
  })

  it('clamps arc radius to at least 2', () => {
    const s = new Shield(0, 0, 60, 60)
    s.damageAt(30, 30, 0.001)
    const arcCall = (lastStubCtx.arc as jest.Mock).mock.calls[0]
    expect(arcCall[2]).toBeGreaterThanOrEqual(2)
  })

  it('does not throw with default radius', () => {
    const s = new Shield(0, 0, 50, 50)
    s.bakeFallback()
    expect(() => s.damageAt(25, 25)).not.toThrow()
  })

  it('restores globalCompositeOperation after call', () => {
    const s = new Shield(0, 0, 60, 60)
    s.damageAt(30, 30, 10)
    expect(lastStubCtx.globalCompositeOperation).toBe('source-over')
  })
})

describe('Shield — draw', () => {
  it('draws buffer onto external context at correct position', () => {
    const s = new Shield(10, 20, 80, 60)
    const externalCtx = createStubCtx()

    s.draw(externalCtx as unknown as CanvasRenderingContext2D)

    expect(externalCtx.imageSmoothingEnabled).toBe(false)
    expect(externalCtx.drawImage as jest.Mock).toHaveBeenCalledWith(
      expect.anything(),
      10,
      20,
      80,
      60
    )
  })
})
