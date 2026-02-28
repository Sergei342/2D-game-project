export class Input {
  private keys = new Set<string>()

  private onKeyDown = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code))
      e.preventDefault()
    this.keys.add(e.code)
  }

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code)
  }

  attach() {
    window.addEventListener('keydown', this.onKeyDown, { passive: false })
    window.addEventListener('keyup', this.onKeyUp, { passive: false })
  }

  detach() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  down(code: 'ArrowLeft' | 'ArrowRight' | 'Space') {
    return this.keys.has(code)
  }
}
