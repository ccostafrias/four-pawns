export function parseBoardString(fenString) {
  const board = []
  const rowsData = fenString.split("/")

  for (let row = 0; row < rowsData.length; row++) {
    const line = rowsData[row]
    let col = 0

    for (const char of line) {
      if (/\d/.test(char)) {
        const emptyCount = parseInt(char, 10)
        for (let i = 0; i < emptyCount; i++) {
          col++
        }
      } else if (char === "X") {
        board.push({
          type: 'X',
          row,
          col,
          id: row * 4 + col,
        })
        col++
      } else {
        const isWhite = char === char.toUpperCase()
        board.push({
          type: char.toUpperCase(),
          color: isWhite ? "white" : "black",
          row,
          col,
          id: row * 4 + col,
        })
        col++
      }
    }
  }

  return board
}
