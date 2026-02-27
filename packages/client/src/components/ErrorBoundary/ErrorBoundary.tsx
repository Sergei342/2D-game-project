import { Component, PropsWithChildren } from 'react'

type State = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  PropsWithChildren<unknown>,
  State
> {
  constructor(props: PropsWithChildren<unknown>) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the error component UI.
    return { hasError: error }
  }

  componentDidCatch(error: Error) {
    this.state = { error }
  }

  render() {
    if (this.state.error) {
      // You can render any custom error component UI
      return <div>ErrorComponent!!!</div>
    }

    return this.props.children
  }
}
