import { useEffect, useState } from "react"

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("theme") || 'classic'
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function setTheme(newTheme) {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
  }

  function applyTheme(themeName) {
    const root = document.body.style
    const prefix = `/assets/pieces/${themeName}/`

    const pieces = [
      "bb", "bk", "bn", "bp", "bq", "br",
      "wb", "wk", "wn", "wp", "wq", "wr"
    ]

    for (const piece of pieces) {
      root.setProperty(`--${piece}`, `url('${prefix}${piece}.png')`)
    }
  }

  return { theme, setTheme }
}