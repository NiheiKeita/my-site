interface PopupProps {
  content: string;
  onClose: () => void;
}

export const Popup = ({ content, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[90%] max-w-md rounded-lg bg-gray-800 p-4 shadow-lg">
        <div className="text-white">
          <div className="mb-4 text-lg leading-relaxed">{content}</div>
          <div className="text-center">
            <button
              onClick={onClose}
              className="rounded bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600"
            >
              決定
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 