import { atom } from 'jotai'
import { Position } from '~/types/game'

export const playerPositionAtom = atom<Position>({ x: 4, y: 4 }) 