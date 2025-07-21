export function getPieceAbbr(piece) {
    return `${piece.color.charAt(0).toLowerCase()}${piece.type.toLowerCase()}`
}