import { useState } from 'react'
import { GameStart } from '../GameStart'

export const GamePage = () => {
  const [showModal, setShowModal] = useState(true)

  const handleFinish = () => {
    setShowModal(false)
    console.log('game init')
  }

  return (
    <>
      <GameStart open={showModal} onFinish={handleFinish} />

      {/* Здесь канвас игра */}
      <div id="game-root" />
    </>
  )
}
