import { MapData } from "~/types/game"
import { firstObjects } from "./first/firstObjects"
import { secondObjects } from "./second/secondObjects"
import { thirdObjects } from "./Third/thirdObjects"
import { firstEnemies } from "./first/enemies"
import { secondEnemies } from "./second/enemies"
import { thirdEnemies } from "./Third/enemies"

// マップデータのエクスポート
export const maps: MapData[] = [
  {
    id: 'first-floor',
    name: '1階',
    width: 8,
    height: 8,
    gameObjects: firstObjects,
    enemies: firstEnemies,
    stairs: {
      down: {
        mapId: 'second-floor',
        position: { x: 7, y: 7 }
      }
    }
  },
  {
    id: 'second-floor',
    name: '2階',
    width: 8,
    height: 8,
    gameObjects: secondObjects,
    enemies: secondEnemies,
    stairs: {
      up: {
        mapId: 'first-floor',
        position: { x: 7, y: 7 }
      },
      down: {
        mapId: 'third-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'third-floor',
    name: '3階',
    width: 8,
    height: 8,
    gameObjects: thirdObjects,
    enemies: thirdEnemies,
    stairs: {
      up: {
        mapId: 'second-floor',
        position: { x: 0, y: 0 }
      }
    }
  }
]