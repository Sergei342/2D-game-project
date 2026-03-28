import { Input } from './Input'

describe('Input', () => {
  let input: Input

  beforeEach(() => {
    input = new Input()
    input.attach()
  })

  afterEach(() => {
    input.detach()
  })

  it('should return false when no keys are pressed', () => {
    expect(input.down('ArrowLeft')).toBe(false)
    expect(input.down('ArrowRight')).toBe(false)
    expect(input.down('Space')).toBe(false)
  })

  it('should return true after keydown, false after keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }))

    expect(input.down('ArrowLeft')).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }))

    expect(input.down('ArrowLeft')).toBe(false)
  })

  it('should return true after keydown, false after keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }))

    expect(input.down('ArrowRight')).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }))

    expect(input.down('ArrowRight')).toBe(false)
  })

  it('should return true after keydown, false after keyup', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))

    expect(input.down('Space')).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' }))

    expect(input.down('Space')).toBe(false)
  })
})
