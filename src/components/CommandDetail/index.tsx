
import { items } from '../../data/items'
import { bagItemsAtom } from '../../store/bag'
import { useAtom } from 'jotai'

interface CommandDetailProps {
  type: 'spell' | 'item' | 'status' | 'equip' | 'skill'
  onClose: () => void
}

export const CommandDetail = ({ type, onClose }: CommandDetailProps) => {
  const [bagItemIDs] = useAtom(bagItemsAtom)

  const bagItems = bagItemIDs.map((id) => items.find((item) => item?.id === id)).filter(item => item !== undefined)
  // 仮のデータ
  const spellData = [
    { name: 'コピペ', mp: 1, description: '過去の知識を召喚して作業時間を短縮する' },
    { name: 'リファクタ', mp: 4, description: 'コードの可読性と保守性を高める' },
    { name: 'デバッグ', mp: 6, description: 'バグを発見し修正する。成功率は運次第' },
    { name: 'コミット', mp: 2, description: '変更内容を記録して未来に備える' },
    { name: 'プルリク', mp: 3, description: '他者の力を借りる連携呪文。レビューが必要' },
    { name: 'シェル芸', mp: 8, description: 'ターミナルで複雑な処理を一瞬で完了する禁術' },
    { name: 'npm install', mp: 5, description: '未知の力（ライブラリ）を召喚する儀式' },
    { name: '再起動', mp: 10, description: 'あらゆる不具合が治る可能性がある大技' },
    { name: 'コーヒーブースト', mp: 0, description: '眠気を吹き飛ばし一時的に集中力が上がる' },
    { name: 'ググレ', mp: 2, description: '知恵の世界（インターネット）から答えを引き出す' },
  ]

  // const itemData = [
  //   { name: 'MacBook Pro', count: 1, description: '最強の道具。神器。' },
  //   { name: 'iPhone 12', count: 1, description: '情報収集、連絡、撮影、なんでもこなす万能道具' },
  //   { name: 'モバイルバッテリー', count: 2, description: '長時間の外出でも安心のMP回復アイテム' },
  //   { name: 'Nintendo Switch', count: 1, description: '様々な世界と繋がれる魔法のゲーム機' },
  //   { name: 'ゲームキューブ', count: 1, description: '懐かしき神ゲーが封じられし古の箱' },
  //   { name: '技術書たち', count: 7, description: '知識とスキルがレベルアップする魔法の書物' },
  //   { name: 'ラズベリーパイ', count: 1, description: '小型ながら多彩な実験ができる魔法の機械' },
  // ]

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
    { slot: '武器', name: 'メカニカルキーボード', attack: 5, description: '打鍵感が気持ちよく、タイピング速度が上がる' },
    { slot: '盾', name: 'AirPods Pro', defense: 4, description: '外界から断絶させ２次元に入るための魔法のイヤホン' },
    { slot: '頭', name: 'フード付きパーカー', defense: 2, description: '安心感が得られるエンジニアの正装' },
    { slot: '体', name: '面白Tシャツ', defense: 3, description: '最強の開発者アーマー' },
    { slot: '手', name: 'トラックボールマウス', attack: 2, description: '素早く正確な操作が可能になるツール' },
    { slot: '足', name: 'キュピサンダル', defense: 1, description: '歩くとキュピキュピ音が鳴るサンダル' },
    { slot: 'アクセサリー1', name: 'スマートウォッチ', defense: 2, description: '健康と通知を管理する万能ガジェット' },
    { slot: 'アクセサリー2', name: 'ブルーライトカットメガネ', defense: 2, description: '目の疲労を軽減する防御メガネ' },
  ]
  const skillData = [
    { name: 'フロントエンド', level: 9, description: 'Next.js、React、TypeScript、TailwindCSSを駆使して、高品質かつモダンなUIを構築。StorybookやJotaiで開発効率と状態管理も最適化' },
    { name: 'バックエンド', level: 7, description: 'LaravelとCakePHPを中心に、Djangoも扱う。RESTful APIや認証、非同期処理まで幅広く対応' },
    { name: 'インフラ', level: 6, description: 'DockerやAWS（EC2、S3、RDSなど）を用いて、開発・本番環境を構築。ラズパイによるハードウェア連携の経験もあり' },
    { name: 'データベース', level: 4, description: 'MySQL、PostgreSQL、Redisを中心に、効率的なスキーマ設計とクエリ最適化が可能。MongoDBにも対応' },
    { name: 'セキュリティ', level: 2, description: '徳丸本を読んだ' },
    { name: 'CI/CD', level: 7, description: 'GitHub Actionsを使ってデプロイ・テストを自動化。アジャイル開発と統合し高速なリリースを実現' },
    { name: 'テスト', level: 8, description: 'Vitest、Jest、Playwrightを活用した単体・E2Eテストを実装。TDD志向での開発経験あり' },
    { name: 'UIライブラリ', level: 6, description: 'MUI、TailwindCSS、jQueryまで、プロジェクトに応じて適切なUI構築が可能。デザインと実装を両立' },
    { name: 'アジャイル開発', level: 6, description: 'スクラムを中心にチーム開発を実践。タスク分割、レビュー、デイリー進捗共有など、円滑な進行をサポート' },
    { name: 'モバイル開発', level: 5, description: 'Kotlin（Android）、Swift（iOS）を用いたネイティブアプリ開発経験あり。Androidアプリを５つ公開中。ARKitを使ったAR実装も対応可能' },
    { name: 'ハードウェア連携', level: 2, description: 'Raspberry Pi を用いたセンサー連携やIoT開発の経験あり。PythonスクリプトやGPIO制御にも対応' }
  ]

  const renderContent = () => {
    switch (type) {
      case 'spell':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {spellData.map((spell) => (
              <div key={spell.name} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between text-white">
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
            {bagItems.map((bagItem) => (
              <div key={bagItem?.name} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between text-white">
                  <span className="font-bold">{bagItem?.name}</span>
                  {/* <span className="text-yellow-400">×{bagItem.count}</span> */}
                </div>
                <div className="text-sm text-gray-300">{bagItem?.description}</div>
              </div>
            ))}
          </div>
        )
      case 'status':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2 text-white">
            <div className="rounded bg-gray-700 p-2">
              <div className="mb-2 text-center font-bold">レベル {statusData.level}</div>
              <div className="grid grid-cols-2 gap-2">
                <div>年齢: 28歳</div>
                <div>身長: 180.4 cm</div>
                <div>体重: 74.2 kg</div>
                <div>性別: 男</div>
                <div>職業: エンジニア</div>
                <div>好きな食べ物: ラーメン</div>
                <div>誕生日: 5/29</div>
              </div>
            </div>
          </div>
        )
      case 'equip':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {equipData.map((equip) => (
              <div key={equip.slot} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between text-white">
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
      case 'skill':
        return (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
            {skillData.map((skill) => (
              <div key={skill.name} className="rounded bg-gray-700 p-2">
                <div className="flex justify-between text-white">
                  <span className="font-bold">{skill.name}</span>
                  <span className="text-green-400">Lv.{skill.level}</span>
                </div>
                <div className="text-sm text-gray-300">{skill.description}</div>
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
      case 'skill':
        return 'スキル'
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