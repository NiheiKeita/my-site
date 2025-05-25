import React from 'react'
import { useAtom } from 'jotai'
import { bagItemsAtom } from '../../store/bag'
import { items } from '../../data/items'
import { Item } from '../../types/item'

interface ItemSelectProps {
  onClose: (itemId?: string) => void
}

export const ItemSelect = ({ onClose }: ItemSelectProps) => {
  const [bagItems] = useAtom(bagItemsAtom)
  const bagItemObjects = bagItems.map(itemId => items.find(item => item.id === itemId)).filter((item): item is Item => item !== undefined)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-800 p-4 rounded-lg w-64">
        <h2 className="text-xl mb-4">アイテム</h2>
        <div className="space-y-2">
          {bagItemObjects.map(item => (
            <button
              key={item.id}
              className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded"
              onClick={() => onClose(item.id)}
            >
              {item.name}
            </button>
          ))}
          <button
            className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded"
            onClick={() => onClose()}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
} 