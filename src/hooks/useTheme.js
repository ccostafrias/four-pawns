import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") || 'classic'
  })

  const [board, setBoardState] = useState(() => {
    return localStorage.getItem("board") || 'nut'
  })

  useEffect(() => {
    applyThemeToElement(document.body, theme, board)
  }, [theme, board])

  function setTheme(newTheme) {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
  }

  function setBoard(newBoard) {
    localStorage.setItem("board", newBoard)
    setBoardState(newBoard)
  }

  function applyThemeToElement(element, themeName = theme, boardName = board) {
    const root = element.style
    const prefix = `/assets/pieces/${themeName}/`
    const boardURL = `/assets/board/${boardName}.png`

    const pieces = [
      "bb", "bk", "bn", "bp", "bq", "br",
      "wb", "wk", "wn", "wp", "wq", "wr"
    ]

    for (const piece of pieces) {
      root.setProperty(
        `--${piece}`,
        `url('${import.meta.env.BASE_URL}${prefix}${piece}.png')`
      )
    }

    root.setProperty('--board', `url('${import.meta.env.BASE_URL}${boardURL}')`)
  }

  // Para aplicar prévia em modal (passando o ref atual do modal)
  function applyPreviewTheme({modalRef, themeName, boardName}) {
    if (!modalRef?.current) return
    applyThemeToElement(modalRef.current, themeName, boardName)
  }

  return {
    theme,
    board,
    setTheme,
    setBoard,
    applyPreviewTheme,
  }
}