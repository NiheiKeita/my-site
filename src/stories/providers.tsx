import { Provider, useAtom } from 'jotai'
import { ReactNode, useEffect } from 'react'
import { playerStatusAtom } from '../store/player'

export const initialPlayerStatus = {
  hp: 10,
  maxHp: 10,
  level: 1,
  exp: 0,
  gold: 0,
  attack: 10,
  defense: 5,
}

const JotaiInitializer = ({ children }: { children: ReactNode }) => {
  const [, setPlayerStatus] = useAtom(playerStatusAtom)

  useEffect(() => {
    setPlayerStatus(initialPlayerStatus)
  }, [setPlayerStatus])

  return <>{children}</>
}

export const JotaiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider>
      <JotaiInitializer>{children}</JotaiInitializer>
    </Provider>
  )
} 