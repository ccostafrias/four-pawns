import React, { useState, useEffect, useRef } from 'react'
import Piece from './Piece'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import '../styles/squares.css'

export default function Board(props) {
    const boardRef = useRef(null)

    useOnClickOutside(boardRef, () => {
        setSelectedPiece(null)
    })

    const {
        board,
        selectedPiece,
        validMoves,
        selectPiece,
        captured,
        movePiece,
        setSelectedPiece,
        setCapturedReady,
    } = props

    const [isDragging, setIsDragging] = useState(false)
    const [hoverPiece, setHoverPiece] = useState(null)

    const piecesEl = board && board.map(p => (
        <Piece
            key={`${p.id}`}
            setCapturedReady={setCapturedReady}
            captured={captured}
            piece={p}
            onDragEnd={onDragEnd}
            boardRef={boardRef}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
        />
    ))

    const highlightsEl = [selectedPiece].filter(el => el !== null)?.map(p => (
        <div
            key={`${p.id}`}
            className={`highlight square-${p.row+1}${p.col+1}`}
        />
    ))

    const hintsEl = validMoves.map(p => (
        <div 
            key={`${p.row}-${p.col}}`}
            className={`square-${p.row+1}${p.col+1} ${p.isCapturable ? 'capture-hint' : 'hint'}`}
        />
    ))

    function onDragEnd (e) {
        console.log()
        setHoverPiece(null)
        handleCellPick(e, boardRef.current)
    }

    const handleBoardMouseMove = (e) => {
        if (!isDragging) return

        const { row, col } = getBoardCellFromTarget(e)

        setHoverPiece({row, col})
    }

    const handleBoardMouseDown = (e) => {
        handleCellPick(e)
    }

    const handleCellPick = (e, target = null) => {
        const { row, col } = getBoardCellFromTarget(e, target)
        const clickedPiece = board.find(p => p.row === row && p.col === col)

        // Caso 1: clicou em uma peça aliada
        if (clickedPiece && clickedPiece.color === "white" && !isDragging) {
            selectPiece(row, col)
            return
        }

        // Caso 2: clicou em uma célula válida de movimento
        const isValidMove = validMoves.some(move => move.row === row && move.col === col)
        if (selectedPiece && isValidMove) {
            movePiece(selectedPiece, row, col)
            return
        }

        // Caso 3: clique inválido - limpa seleção
        if (!isDragging) setSelectedPiece(null)
    }

    return (
        <div
            className='board'
            ref={boardRef}
            onMouseDown={(e) => handleBoardMouseDown(e)} 
            onMouseMove={(e) => handleBoardMouseMove(e)}
        >
            <span className='text description'>Use the standard chess moves to capture the black pawns with the white knight</span>
            <span className='text name'>FOUR PAWNS</span>
            {piecesEl}
            {highlightsEl.length > 0 && highlightsEl}
            {hintsEl.length > 0 && hintsEl}
            {hoverPiece && (
                <div className={`hover square-${hoverPiece.row+1}${hoverPiece.col+1}`}/>
            )}
        </div>
    )

}

function getBoardCellFromTarget(e, target = null, boardW = 4, boardH = 6) {
  const rect = !target ? e.currentTarget.getBoundingClientRect() : target.getBoundingClientRect()
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const cellWidth = rect.width / boardW;
  const cellHeight = rect.height / boardH;

  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);

  return { row, col };
};
