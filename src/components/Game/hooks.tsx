import { useState } from 'react'

interface PlayerStatus {
  hp: number
  maxHp: number
  level: number
  exp: number
  gold: number
  attack: number
  defense: number
}

const initialStatus: PlayerStatus = {
  hp: 100,
  maxHp: 100,
  level: 1,
  exp: 0,
  gold: 0,
  attack: 10,
  defense: 5,
}

export const useGameLogic = () => {
  const [showPopup, setShowPopup] = useState(false)
  const [popupContent, setPopupContent] = useState('')
  const [previousStatus, setPreviousStatus] = useState<PlayerStatus>(initialStatus)

  const setPlayerStatus = (newStatus: PlayerStatus) => {
    if (newStatus.level > previousStatus.level) {
      // レベルアップ時のポップアップ内容を設定
      const content = [
        '✨ レベルアップ！ ✨',
        `レベル ${previousStatus.level} → ${newStatus.level}`,
        `HP: ${previousStatus.maxHp} → ${newStatus.maxHp}`,
        `攻撃力: ${previousStatus.attack} → ${newStatus.attack}`,
        `防御力: ${previousStatus.defense} → ${newStatus.defense}`,
      ].join('\n')
      setPopupContent(content)
      setShowPopup(true)
    }
    setPreviousStatus(newStatus)
  }

  return {
    showPopup,
    setShowPopup,
    popupContent,
    setPlayerStatus,
  }
} 