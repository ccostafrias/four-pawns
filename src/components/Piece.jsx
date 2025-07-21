import React, { useState, useRef } from 'react'
import { getPieceAbbr } from '../utils/getPieceAbbr'
import { motion, useDragControls, useAnimationControls, animationControls } from 'framer-motion'

export default function Piece(props) {
    const { 
        piece,
        setCapturedReady,
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
        setIsDragging(false)
        animationControls.start({
            x:0,
            y:0
        })    
        onDragEnd(e)
    }

    return (
        <motion.div
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e) => handleDragEnd(e)}
            animate={animationControls}
            dragControls={controls}
            dragElastic={0.1}
            whileDrag={{
                zIndex: 300,
                cursor: 'grabbing',
            }}
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
            onLayoutAnimationComplete={() => {
                if (captured?.some(p => p.row == row && p.col == col)) {
                    setCapturedReady(true)
                }
            }}
        >
        </motion.div>
    )
}