import { GameObjectData } from "~/types/game"
import { createStairMessage, messageUtils } from "../messages"

export const tenthObjects: GameObjectData[] = [
  {
    id: 'stairs_1',
    type: 'stairs',
    position: { x: 0, y: 0 },
    message: messageUtils.createMessage(createStairMessage('up')),
    direction: 'up'
  },
  {
    id: 'chest_1',
    type: 'chest',
    position: { x: 3, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ 最終の宝箱 ✨</p>
        <p>ダンジョンの最深部に眠る宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'boss_chest',
    type: 'chest',
    position: { x: 5, y: 3 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">✨ ボスの宝箱 ✨</p>
        <p>ボスを倒した証の宝箱だ。</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'boss_1',
    type: 'enemy',
    position: { x: 4, y: 4 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">👹 ボス 👹</p>
        <p>強そうな敵が現れた！</p>
      </>,
      'text-red-500'
    ),
    enemyId: 12
  },
  {
    id: 'pot_1',
    type: 'pot',
    position: { x: 5, y: 2 },
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
    position: { x: 5, y: 5 },
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
    position: { x: 3, y: 5 },
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
    position: { x: 2, y: 5 },
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
    position: { x: 2, y: 4 },
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
    position: { x: 2, y: 3 },
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
    position: { x: 2, y: 2 },
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
    position: { x: 3, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
  {
    id: 'pot_13',
    type: 'pot',
    position: { x: 4, y: 2 },
    message: messageUtils.createMessage(
      <>
        <p className="text-lg mb-2">ただの壺</p>
        <p>何も入っていない</p>
      </>,
      'text-yellow-300'
    )
  },
] 