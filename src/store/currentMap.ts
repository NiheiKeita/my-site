import { atom } from 'jotai'
import { maps } from '~/data/maps'
import type { MapData } from '~/types/game'

export const currentMapAtom = atom<MapData>(maps[0]) 