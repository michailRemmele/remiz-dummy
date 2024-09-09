import type { ActorEvent, SceneEvent } from 'remiz';

export const MovementDirection = 'MovementDirection';
export const GameOver = 'GameOver';

export type MovementDirectionEvent = ActorEvent<{
  x: number
  y: number
}>;

export type GameOverEvent = SceneEvent<{ isWin: boolean }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [MovementDirection]: MovementDirectionEvent
  }

  export interface SceneEventMap {
    [GameOver]: GameOverEvent
  }
}
