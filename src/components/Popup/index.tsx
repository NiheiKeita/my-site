interface PopupProps {
  content: string;
  onClose: () => void;
}

export const Popup = ({ content, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="text-white">
          <div className="text-lg leading-relaxed mb-4">{content}</div>
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 