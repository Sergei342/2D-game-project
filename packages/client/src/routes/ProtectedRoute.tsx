interface Props {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
  return children
}

export const GuestRoute = ({ children }: Props) => {
  return children
}
