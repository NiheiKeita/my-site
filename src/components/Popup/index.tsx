import { ReactNode } from 'react'

interface PopupProps {
  content: ReactNode
  onClose: () => void
}

export const Popup = ({ content, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-white">
          {content}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          閉じる
        </button>
      </div>
    </div>
  )
} 