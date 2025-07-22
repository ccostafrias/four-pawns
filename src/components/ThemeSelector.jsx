import React from "react"

export default function ThemeSelector({ list, theme, onThemeChange }) {
  function handleChange(e) {
      onThemeChange(e)
  }

  const reorderedList = [
    theme,
    ...list.filter(item => item !== theme)
  ]

  return (
    <div className="theme-selector">
      <select value={theme} onChange={handleChange}>
        {reorderedList.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  )
}