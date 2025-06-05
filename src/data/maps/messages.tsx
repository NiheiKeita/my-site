import React from 'react'

export const messageUtils = {
  createMessage: (content: React.ReactNode, className: string = 'text-gray-300') => (
    <div className={className}>
      {content}
    </div>
  )
}

export const createStairMessage = (direction: 'up' | 'down') => (
  <>
    <p className="text-lg mb-2">{direction === 'up' ? '上へ続く階段' : '下へ続く階段'}</p>
    <p>{direction === 'up' ? '上の階へ続く階段がある。' : '下の階へ続く階段がある。'}</p>
  </>
)
