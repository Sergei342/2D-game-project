import { Assets, AssetKey, DEFAULT_SOURCES } from './Assets'

describe('Assets', () => {
  const keys = Object.keys(DEFAULT_SOURCES) as AssetKey[]

  it('should assign default src to every image', () => {
    const assets = new Assets()

    keys.forEach(key => {
      expect(assets.get(key).src).toContain(DEFAULT_SOURCES[key])
    })
  })

  it('should override source when custom partial sources provided', () => {
    const assets = new Assets({ bg: '/custom/bg.png' })

    expect(assets.get('bg').src).toContain('/custom/bg.png')
  })

  it('ready() should return false when image is not loaded (complete false)', () => {
    const assets = new Assets()

    keys.forEach(key => {
      expect(assets.ready(key)).toBe(false)
    })
  })

  it('ready() should return false when complete is true but naturalWidth is 0', () => {
    const assets = new Assets()
    const img = assets.get('player')

    Object.defineProperty(img, 'complete', { value: true })
    Object.defineProperty(img, 'naturalWidth', { value: 0 })

    expect(assets.ready('player')).toBe(false)
  })

  it('ready() should return true when complete is true and naturalWidth > 0', () => {
    const assets = new Assets()
    const img = assets.get('bg')

    Object.defineProperty(img, 'complete', { value: true })
    Object.defineProperty(img, 'naturalWidth', { value: 100 })

    expect(assets.ready('bg')).toBe(true)
  })

  it('should resolve when every image fires onload', async () => {
    const assets = new Assets()
    const promise = assets.loadAll()

    keys.forEach(key => {
      const img = assets.get(key)
      const loadEvent = new Event('load')
      img.onload?.call(img, loadEvent)
    })

    await expect(promise).resolves.toBeUndefined()
  })

  it('should resolve when every image fires onerror (fallback)', async () => {
    const assets = new Assets()
    const promise = assets.loadAll()

    keys.forEach(key => {
      const img = assets.get(key)
      const errorEvent = new Event('error')
      img.onerror?.call(img, errorEvent)
    })

    await expect(promise).resolves.toBeUndefined()
  })
})
