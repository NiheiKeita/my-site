import { MapData } from "~/types/game"
import { firstObjects } from "./first/firstObjects"
import { secondObjects } from "./second/secondObjects"
import { thirdObjects } from "./Third/thirdObjects"
import { fourthObjects } from "./fourth/fourthObjects"
import { fifthObjects } from "./fifth/fifthObjects"
import { sixthObjects } from "./sixth/sixthObjects"
import { seventhObjects } from "./seventh/seventhObjects"
import { eighthObjects } from "./eighth/eighthObjects"
import { ninthObjects } from "./ninth/ninthObjects"
import { tenthObjects } from "./tenth/tenthObjects"
import { firstEnemies } from "./first/enemies"
import { secondEnemies } from "./second/enemies"
import { thirdEnemies } from "./Third/enemies"
import { fourthEnemies } from "./fourth/enemies"
import { fifthEnemies } from "./fifth/enemies"
import { sixthEnemies } from "./sixth/enemies"
import { seventhEnemies } from "./seventh/enemies"
import { eighthEnemies } from "./eighth/enemies"
import { ninthEnemies } from "./ninth/enemies"
import { tenthEnemies } from "./tenth/enemies"

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
      },
      down: {
        mapId: 'fourth-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'fourth-floor',
    name: '4階',
    width: 8,
    height: 8,
    gameObjects: fourthObjects,
    enemies: fourthEnemies,
    stairs: {
      up: {
        mapId: 'third-floor',
        position: { x: 0, y: 0 }
      },
      down: {
        mapId: 'fifth-floor',
        position: { x: 7, y: 7 }
      }
    }
  },
  {
    id: 'fifth-floor',
    name: '5階',
    width: 8,
    height: 8,
    gameObjects: fifthObjects,
    enemies: fifthEnemies,
    stairs: {
      up: {
        mapId: 'fourth-floor',
        position: { x: 7, y: 7 }
      },
      down: {
        mapId: 'sixth-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'sixth-floor',
    name: '6階',
    width: 8,
    height: 8,
    gameObjects: sixthObjects,
    enemies: sixthEnemies,
    stairs: {
      up: {
        mapId: 'fifth-floor',
        position: { x: 0, y: 0 }
      },
      down: {
        mapId: 'seventh-floor',
        position: { x: 7, y: 7 }
      }
    }
  },
  {
    id: 'seventh-floor',
    name: '7階',
    width: 8,
    height: 8,
    gameObjects: seventhObjects,
    enemies: seventhEnemies,
    stairs: {
      up: {
        mapId: 'sixth-floor',
        position: { x: 7, y: 7 }
      },
      down: {
        mapId: 'eighth-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'eighth-floor',
    name: '8階',
    width: 8,
    height: 8,
    gameObjects: eighthObjects,
    enemies: eighthEnemies,
    stairs: {
      up: {
        mapId: 'seventh-floor',
        position: { x: 0, y: 0 }
      },
      down: {
        mapId: 'ninth-floor',
        position: { x: 7, y: 7 }
      }
    }
  },
  {
    id: 'ninth-floor',
    name: '9階',
    width: 8,
    height: 8,
    gameObjects: ninthObjects,
    enemies: ninthEnemies,
    stairs: {
      up: {
        mapId: 'eighth-floor',
        position: { x: 7, y: 7 }
      },
      down: {
        mapId: 'tenth-floor',
        position: { x: 0, y: 0 }
      }
    }
  },
  {
    id: 'tenth-floor',
    name: '10階',
    width: 8,
    height: 8,
    gameObjects: tenthObjects,
    enemies: tenthEnemies,
    stairs: {
      up: {
        mapId: 'ninth-floor',
        position: { x: 0, y: 0 }
      }
    }
  }
]