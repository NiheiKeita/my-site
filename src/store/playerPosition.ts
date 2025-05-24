import { atom } from 'jotai'

interface Position {
  x: number
  y: number
}

export const playerPositionAtom = atom<Position>({ x: 4, y: 4 }) 