interface PopupProps {
  content: string;
  onClose: () => void;
}

export const Popup = ({ content, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4 text-gray-800">{content}</p>
        <button
          className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  )
} 