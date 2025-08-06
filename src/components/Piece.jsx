import React, { useState, useRef, useEffect } from 'react'
import { getPieceAbbr } from '../utils/getPieceAbbr'
import { motion, useDragControls, useAnimationControls, animationControls } from 'framer-motion'

export default function Piece(props) {
    const { 
        piece,
        captured,
        boardRef,
        onDragEnd,
        isDragging,
        setIsDragging,
     } = props

    const [cols, rows] = [4, 6]
    const { row, col, id } = piece
    
    const typeAbbr = piece.type !== 'X' ? getPieceAbbr(piece) : 'blocked'

    const container = boardRef.current;
    const width = container?.offsetWidth;
    const height = container?.offsetHeight;

    const controls = useDragControls()
    const animationControls = useAnimationControls()

    const handleDragEnd = (e) => {
        animationControls.start({
            x:0,
            y:0
        })    
        onDragEnd(e)
    }

    const [dragAnimation, setDragAnimation] = useState(false)    

    return (
        <motion.div
            onDragStart={() => {
                if (piece.type == 'X') return
                setIsDragging(piece)
                setDragAnimation(true)
            }}
            onDragEnd={(e) => handleDragEnd(e)}
            animate={animationControls}
            dragControls={controls}
            dragElastic={0.05}
            style={dragAnimation ? {
                zIndex: 300,
                cursor: 'grabbing',
            } : {}}
            drag
            // dragConstraints={boardRef}
            dragConstraints={{ 
                left: -(1/cols/2)*width-(col/cols)*width, 
                right: (1-1/cols/2)*width-(col/cols)*width,
                top: -(1/rows/2)*height-(row/rows)*height,
                bottom: (1-1/rows/2)*height-(row/rows)*height
            }}
            dragMomentum={false}

            layoutId={id}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`piece square-${row+1}${col+1} ${typeAbbr}`}
            onAnimationComplete={() => {
                if (isDragging?.id == piece.id) return
                setDragAnimation(false) 
            }}
        >
        </motion.div>
    )
}