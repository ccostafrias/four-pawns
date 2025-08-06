import React, { useState, useRef, useEffect } from 'react'
import { useGameLogic } from './hooks/useGameLogic'
import { useTheme } from './hooks/useTheme'
import { getPieceAbbr } from './utils/getPieceAbbr'
import { motion, LayoutGroup } from 'framer-motion'
import { FaRedo, FaChevronLeft, FaChevronRight, FaGithub } from 'react-icons/fa'
import { FaGear } from 'react-icons/fa6'
import Board from './components/Board'
import ThemeSelector from './components/ThemeSelector'
import CustomModal from './components/CustomModal'
import { parseBoardString } from './utils/parseBoardString'
import { themeList, boardList } from "./data/themes"
import ConfettiExplosion from 'react-confetti-explosion';

import './styles/Game.css'

export default function App() {
  // const fen = 'pppp/XXXX/BBBB/RRRR/PPP1/XXXN'
  const fen = 'pppp/XXXX/pppp/pppp/p1pp/XXXN'

  const {
      board,
      selectedPiece,
      validMoves,
      captured,
      currentMove,
      boardHistory,
      isWon,
      selectPiece,
      movePiece,
      resetGame,
      setSelectedPiece,
      undo,
      redo,
  } = useGameLogic(fen)

  const {
    theme, 
    board: boardBg, 
    setTheme, 
    setBoard: setBoardBg, 
    applyPreviewTheme
  } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme)
  const [selectedBoardBg, setSelectedBoardBg] = useState(boardBg)
  const [modalOpen, setModalOpen] = useState(false)
  const [winOpen, setWinOpen] = useState(false)
  // const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    if (isWon) setWinOpen(true)
  }, [isWon])

  const modalRef = useRef(null)

  const capturedsEl = captured.map((p, i) => (
      <motion.div
        key={`captured-${p.id || i}`}
        style={{
          '--rows': 4,
        }}
        layoutId={p.id}
        transition={{ type: "spring", stiffness: 500, damping: 30, delay: .1 }}
        className={`captured-piece piece ${getPieceAbbr(p)}`}
      >
      </motion.div>
  ))

  return (
    <>
      <CustomModal
        isOpen={modalOpen} 
        hasDelay={false}
        hasBg={true}
        onRequestClose={() => setModalOpen(false)}
        onAfterClose={() => {
          setSelectedBoardBg(theme)
          setSelectedBoardBg(boardBg)
        }}
        shouldClose={true}
        contentRef={(el) => {
          modalRef.current = el
          // Aplicar o tema atual quando o modal abrir
          if (el) applyPreviewTheme(modalRef, theme, boardBg)
        }}
        footer={(
          <>
            <button 
              className='modal-bttn' 
              onClick={() => setModalOpen(false)}
              autoFocus
            >
              Cancel
            </button>
            <button 
              className='modal-bttn save' 
              disabled={theme === selectedTheme && boardBg === selectedBoardBg} 
              onClick={() => {
                setTheme(selectedTheme)
                setBoardBg(selectedBoardBg)
              }}
            >
              Save
            </button>
          </>
        )}
      >
        <div className='board-prev' style={{'--rows': 2.5, '--cols': 8}}>
          {parseBoardString('rnbqkbnr/pppppppp').map((p, i) => {
            return (
              <div
                key={i}
                style={{width: "12.5%"}}
                className={`piece square-${p.row+1}${p.col+1} ${getPieceAbbr(p)}`}
              />
            )
          })}
          </div>
          <div className='modal-items'>
            <div className='modal-item'>
              <span className='text-item'>Pieces</span>
              <ThemeSelector
                list={themeList}
                theme={selectedTheme}
                onThemeChange={(e) => {
                    const newTheme = e.target.value
                    setSelectedTheme(newTheme) // atualiza estado temporário no modal
                    applyPreviewTheme({modalRef, boardName: selectedBoardBg, themeName: newTheme}) // aplica as variáveis no modal
                }}
                previewContainerRef={modalRef}
              />
            </div>
            <div className='modal-item'>
              <span className='text-item'>Board</span>
              <ThemeSelector
                list={boardList}
                theme={selectedBoardBg}
                onThemeChange={(e) => {
                    const newBoardBg = e.target.value
                    setSelectedBoardBg(newBoardBg) // atualiza estado temporário no modal
                    applyPreviewTheme({modalRef, boardName: newBoardBg, themeName: selectedTheme}) // aplica as variáveis no modal
                }}
                previewContainerRef={modalRef}
              />
            </div>
          </div>
      </CustomModal>
      <CustomModal
        isOpen={winOpen} 
        hasDelay={true}
        hasBg={false}
        onRequestClose={() => setWinOpen(false)}
        onAfterClose={() => {
          resetGame()
        }}
        shouldClose={false}
        contentRef={null}
        footer={(
          <>
            <button 
              className='modal-bttn alone' 
              onClick={() => setWinOpen(false)}
            >
              RESET
            </button>
          </>
        )}
      >
        <h2>You did it!</h2>
        <span className='won-text'>You cracked the puzzle with just <span style={{fontWeight: 'bold'}}>{boardHistory.length}</span> moves!</span>
      </CustomModal>
      {isWon && (
        <div className='center-anchor'>
          <ConfettiExplosion
            zIndex={200}
            onComplete={() => {}}
          />
        </div>
      )}
      <header className='game-header'>
        <button className='bttn-header' onClick={() => resetGame()} disabled={boardHistory.length == 1}>
          <FaRedo className='bttn-icon' />
        </button>
        <button className='bttn-header' onClick={() => undo()} disabled={currentMove === 0}>
          <FaChevronLeft  className='bttn-icon' />
        </button>
        <button className='bttn-header' onClick={() => redo()} disabled={currentMove >= boardHistory.length - 1}>
          <FaChevronRight  className='bttn-icon' />
        </button>
        <button className='bttn-header' onClick={() => setModalOpen(true)}>
          <FaGear className='bttn-icon' />
        </button>
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
          />
        </LayoutGroup>
      </main>
      <footer className="home-footer">
        <a href="https://github.com/ccostafrias" target="_blank">  
          <FaGithub className="svg-footer"/>
        </a>
      </footer>
    </>
  )
}
