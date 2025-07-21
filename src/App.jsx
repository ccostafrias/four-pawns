import React, { useState } from 'react'
import Board from './components/Board'
import ThemeSelector from './components/ThemeSelector'
import { useGameLogic } from './hooks/useGameLogic'
import { getPieceAbbr } from './utils/getPieceAbbr'
import { motion, LayoutGroup } from 'framer-motion'
import './styles/Game.css'

export default function App() {
  const fen = 'pppp/XXXX/BBBB/RRRR/PPP1/XXXN'
  // const fen = 'pppp/XXXX/pppp/pppp/p1pp/XXXN'

  const {
      board,
      selectedPiece,
      validMoves,
      captured,
      currentMove,
      boardHistory,
      selectPiece,
      movePiece,
      resetGame,
      setSelectedPiece,
      undo,
      redo,
  } = useGameLogic(fen)

  const [capturedReady, setCapturedReady] = useState(false);

  // const capturedsEl = [{type: 'P', color: 'Black', row: 5, col: 2}].map((p, i) => (
  const capturedsEl = captured.map((p, i) => (
      <motion.div
        key={`captured-${p.id}`}
        style={{
          '--rows': 4,
        }}
        layoutId={p.id}
        transition={{ type: "spring", stiffness: 500, damping: 30, delay: .1 }}
        className={`${p.id} captured-piece piece square-${i+1}1 ${getPieceAbbr(p)}`}
      >
      </motion.div>
  ))

  return (
    <>
      <header className='game-header'>
        <div className='reset-bttn'>
          <button onClick={() => resetGame()}>Reset</button>
          <button onClick={() => undo()} disabled={currentMove === 0}>Undo</button>
          <button onClick={() => redo()} disabled={currentMove >= boardHistory.length - 1}>Redo</button>
        </div>
        <ThemeSelector/>
      </header>
      <main className='main-game'>
        <LayoutGroup mode='wait'>
          <div className='captured'>
            {capturedsEl.length > 0 && capturedsEl}
          </div>
          <Board
            board={board}
            selectedPiece={selectedPiece}
            validMoves={validMoves}
            selectPiece={selectPiece}
            movePiece={movePiece}
            setSelectedPiece={setSelectedPiece}
            captured={captured}
            setCapturedReady={setCapturedReady}
          />
        </LayoutGroup>
      </main>
      <footer></footer>
    </>
  )
}
