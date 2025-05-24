import { atom } from 'jotai'
import { Position } from '~/types/game'

const initialPosition: Position = { x: 4, y: 4 }

export const playerPositionAtom = atom<Position>(initialPosition) 