import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const secondObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 7, y: 7 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'stairs_2',
    type: 'stairs',
    position: { x: 5, y: 5 },
    message: messageUtils.createMessage(createStairMessage('down')),
    direction: 'down'
  },
  {
    id: 'pot_1',
    type: 'pot',
    position: { x: 6, y: 7 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_2',
    type: 'pot',
    position: { x: 6, y: 6 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_3',
    type: 'pot',
    position: { x: 6, y: 5 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_4',
    type: 'pot',
    position: { x: 6, y: 4 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_5',
    type: 'pot',
    position: { x: 6, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_6',
    type: 'pot',
    position: { x: 6, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_7',
    type: 'pot',
    position: { x: 6, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_8',
    type: 'pot',
    position: { x: 5, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_9',
    type: 'pot',
    position: { x: 4, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_10',
    type: 'pot',
    position: { x: 3, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_11',
    type: 'pot',
    position: { x: 2, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_12',
    type: 'pot',
    position: { x: 1, y: 1 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
]