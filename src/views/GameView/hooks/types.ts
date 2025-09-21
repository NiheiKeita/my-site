import type { ActorRefFrom, StateFrom } from 'xstate'
import { gameMachine } from '../machine'

export type GameState = StateFrom<typeof gameMachine>
export type GameActor = ActorRefFrom<typeof gameMachine>
export type GameSend = GameActor['send']
