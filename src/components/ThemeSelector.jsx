import { useTheme } from "../hooks/useTheme"

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const themes = ["bunito", "classic", "default", "null_tale", "pixel", "simple"]

  return (
    <div className="theme-selector">
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          {themes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
    </div>
  )
}