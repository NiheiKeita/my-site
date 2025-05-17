interface CommandDetailProps {
  type: 'spell' | 'item' | 'status' | 'equip'
  onClose: () => void
}

export const CommandDetail = ({ type, onClose }: CommandDetailProps) => {
  // 仮のデータ
  const spellData = [
    { name: 'ホイミ', mp: 4, description: 'HPを回復する' },
    { name: 'ギラ', mp: 4, description: '敵に炎のダメージ' },
    { name: 'スカラ', mp: 2, description: '防御力を上げる' },
    { name: 'ベホイミ', mp: 8, description: 'HPを大きく回復する' },
    { name: 'ギラデイン', mp: 12, description: '敵全体に炎のダメージ' },
    { name: 'スカラデイン', mp: 6, description: '味方全体の防御力を上げる' },
    { name: 'ベギラマ', mp: 10, description: '敵に強力な炎のダメージ' },
    { name: 'ベホマ', mp: 15, description: 'HPを完全に回復する' },
    { name: 'メラ', mp: 2, description: '敵に小さな炎のダメージ' },
    { name: 'メラミ', mp: 6, description: '敵に中程度の炎のダメージ' },
  ]

  const itemData = [
    { name: 'やくそう', count: 5, description: 'HPを回復する' },
    { name: 'キメラのつばさ', count: 3, description: '街に戻る' },
    { name: 'せいすい', count: 2, description: '毒を治す' },
    { name: 'どくけしそう', count: 4, description: '毒を治す' },
    { name: 'まほうのせいすい', count: 2, description: '呪いを治す' },
    { name: 'せかいじゅのは', count: 1, description: '蘇生する' },
    { name: 'まほうのカギ', count: 3, description: '魔法の扉を開ける' },
    { name: 'きせきのつるぎ', count: 1, description: '攻撃力が上がる' },
    { name: 'まほうのたて', count: 1, description: '防御力が上がる' },
    { name: 'まほうのよろい', count: 1, description: '防御力が大きく上がる' },
  ]

  const statusData = {
    level: 5,
    exp: 120,
    nextLevel: 200,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    attack: 15,
    defense: 12,
    speed: 10,
    luck: 8,
    gold: 1500,
  }

  const equipData = [
    { slot: '武器', name: '銅の剣', attack: 5, description: '基本的な剣' },
    { slot: '盾', name: '皮の盾', defense: 3, description: '基本的な盾' },
    { slot: '頭', name: '皮の帽子', defense: 2, description: '基本的な帽子' },
    { slot: '体', name: '旅人の服', defense: 4, description: '基本的な服' },
    { slot: '手', name: '皮の手袋', defense: 1, description: '基本的な手袋' },
    { slot: '足', name: '皮の靴', defense: 2, description: '基本的な靴' },
    { slot: 'アクセサリー1', name: '守りの指輪', defense: 2, description: '防御力が上がる' },
    { slot: 'アクセサリー2', name: '力の指輪', attack: 2, description: '攻撃力が上がる' },
  ]

  const renderContent = () => {
    switch (type) {
      case 'spell':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {spellData.map((spell) => (
              <div key={spell.name} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between">
                  <span className="font-bold">{spell.name}</span>
                  <span className="text-blue-400">MP {spell.mp}</span>
                </div>
                <div className="text-sm text-gray-300">{spell.description}</div>
              </div>
            ))}
          </div>
        )
      case 'item':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {itemData.map((item) => (
              <div key={item.name} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-yellow-400">×{item.count}</span>
                </div>
                <div className="text-sm text-gray-300">{item.description}</div>
              </div>
            ))}
          </div>
        )
      case 'status':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            <div className="rounded bg-gray-700 p-2">
              <div className="mb-2 text-center font-bold">レベル {statusData.level}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>経験値: {statusData.exp}/{statusData.nextLevel}</div>
                <div>所持金: {statusData.gold}G</div>
                <div>HP: {statusData.hp}/{statusData.maxHp}</div>
                <div>MP: {statusData.mp}/{statusData.maxMp}</div>
                <div>攻撃力: {statusData.attack}</div>
                <div>防御力: {statusData.defense}</div>
                <div>素早さ: {statusData.speed}</div>
                <div>運: {statusData.luck}</div>
              </div>
            </div>
          </div>
        )
      case 'equip':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {equipData.map((equip) => (
              <div key={equip.slot} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between">
                  <span className="font-bold">{equip.slot}</span>
                  <span>{equip.name}</span>
                </div>
                <div className="text-sm text-gray-300">{equip.description}</div>
                {equip.attack && <div className="text-sm text-red-400">攻撃力 +{equip.attack}</div>}
                {equip.defense && <div className="text-sm text-blue-400">防御力 +{equip.defense}</div>}
              </div>
            ))}
          </div>
        )
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'spell':
        return '呪文'
      case 'item':
        return 'バッグ'
      case 'status':
        return '強さ'
      case 'equip':
        return '装備'
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-80 rounded-lg bg-gray-800 p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="rounded bg-gray-700 px-3 py-1 text-white transition-colors hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  )
} 