import { useState, useEffect } from "react"
import { parseBoardString } from "../utils/parseBoardString"

export function useGameLogic(initialFen, rows = 6, cols = 4) {
  const [board, setBoard] = useState(() => parseBoardString(initialFen))
  const [captured, setCaptured] = useState([])
  const [boardHistory, setBoardHistory] = useState([{ board, captured }])
  const [currentMove, setCurrentMove] = useState(0)
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [validMoves, setValidMoves] = useState([])

  useEffect(() => {
    if (selectedPiece) {
      const piece = board.find(p => p.row === selectedPiece.row && p.col === selectedPiece.col)
      if (piece) {
        const moves = getValidMoves(piece, board, rows, cols)
        setValidMoves(moves)
      } else {
        setValidMoves([])
      }
    } else {
      setValidMoves([])
    }
  }, [selectedPiece, board])

  function selectPiece(row, col) {
    const piece = board.find(p => p.row === row && p.col === col)

    if (!piece || piece.color !== "white" || piece.type === 'X') return

    setSelectedPiece(piece)
  }

  function movePiece(piece, toRow, toCol) {
    if (!piece || !validMoves.some(m => m.row === toRow && m.col === toCol)) return

    const fromRow = piece.row
    const fromCol = piece.col

    // Cria uma nova cópia do tabuleiro
    const newBoard = board
      // Remove a peça capturada (se houver) na posição de destino
      .filter(p => !(p.row === toRow && p.col === toCol))
      // Atualiza a peça que foi movida
      .map(p => {
        if (p.row === fromRow && p.col === fromCol) {
          return { ...p, row: toRow, col: toCol }
        }
        return p
      })

    // Captura
    const capturedPiece = board.find(p => p.row === toRow && p.col === toCol && p.color === "black")
    if (capturedPiece) {
      setCaptured(prev => [...prev, capturedPiece])
    }

    setBoard(newBoard)
    setSelectedPiece(null)
    const move = {
      board: newBoard,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece,
      captured: capturedPiece ? [...captured, capturedPiece] : [...captured],
    }

    setBoardHistory(prev => [
      ...prev.slice(0, currentMove + 1),
      move
    ])
    setCurrentMove(prev => prev + 1)
  }

  function resetGame() {
    setBoard(parseBoardString(initialFen, rows, cols))
    setSelectedPiece(null)
    setCaptured([])
  }

  function undo() {
    if (currentMove === 0) return
    const prevMove = currentMove - 1
    setBoard(boardHistory[prevMove].board)
    setCaptured(boardHistory[prevMove].captured)
    setCurrentMove(prevMove)
    setSelectedPiece(null)
  }

  function redo() {
    if (currentMove >= boardHistory.length - 1) return
    const nextMove = currentMove + 1
    setBoard(boardHistory[nextMove].board)
    setCaptured(boardHistory[nextMove].captured)
    setCurrentMove(nextMove)
    setSelectedPiece(null)
  }

  return {
    board,
    selectedPiece,
    validMoves,
    captured,
    currentMove,
    boardHistory,
    selectPiece,
    setSelectedPiece,
    movePiece,
    resetGame,
    undo,
    redo,
  }
}

function getValidMoves(piece, board, rows = 6, cols = 4) {
  const directions = {
    P: [[-1, 0]], // Peão branco (sobe no tabuleiro)
    p: [[1, 0]],  // Peão preto (desce)
    N: [
      [-2, -1], [-1, -2], [-2, 1], [-1, 2],
      [1, -2], [2, -1], [1, 2], [2, 1]
    ],
    B: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
    R: [[-1, 0], [1, 0], [0, -1], [0, 1]],
    Q: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
    K: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]],
  }

  const moves = []
  const isWhite = piece.color === "white"
  const code = piece.type.toUpperCase()
  const [startRow, startCol] = [piece.row, piece.col]

  const getPieceAt = (r, c) => board.find(p => p.row === r && p.col === c)

  const isInBounds = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols

  const addMove = (r, c) => {
    const target = getPieceAt(r, c)

    // ignora células bloqueadas
    if (target?.type === "X") return false

    if (!target) { // se estiver vazio
      moves.push({ row: r, col: c })
    } else if (target.color !== piece.color) {
      moves.push({ row: r, col: c, isCapturable: true })
      return false // não pode continuar nessa direção
    } else {
      return false // bloqueado por aliada
    }
    return true
  }

  // Movimentos específicos para peões
  if (code === "P") {
    const direction = isWhite ? -1 : 1
    const forward = [startRow + direction, startCol]
    if (isInBounds(...forward) && !getPieceAt(...forward)) {
      moves.push({ row: forward[0], col: forward[1] })
    }

    // Capturas diagonais
    for (let dc of [-1, 1]) {
      const diag = [startRow + direction, startCol + dc]
      if (isInBounds(...diag)) {
        const target = getPieceAt(...diag)
        if (target && target.color !== piece.color) {
          moves.push({ row: diag[0], col: diag[1], isCapturable: true })
        }
      }
    }

    return moves
  }

  const dirs = directions[code]
  if (!dirs) return []

  const isSliding = ["B", "R", "Q"].includes(code)

  for (const [dr, dc] of dirs) {
    let r = startRow + dr
    let c = startCol + dc

    while (isInBounds(r, c)) {
      const canContinue = addMove(r, c)
      if (!isSliding || !canContinue) break
      r += dr
      c += dc
    }
  }

  return moves
}