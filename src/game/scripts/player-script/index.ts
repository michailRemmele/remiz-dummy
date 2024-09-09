import type {
  Actor,
  ActorSpawner,
  ScriptOptions,
  Scene,
  UpdateOptions,
} from 'remiz';
import { Script, Transform, Camera } from 'remiz';
import { CollisionEnter } from 'remiz/events';
import type { CollisionEnterEvent } from 'remiz/events';

import { UNIT_SIZE, FIELD_SIZE } from '../../../consts/game';
import { SnakeSegment, Orb, Score } from '../../components';
import { SNAKE_SEGMENT_ID } from '../../../consts/templates';
import * as EventType from '../../events';
import type { MovementDirectionEvent } from '../../events';

const MOVEMENT_RATE = 125;
const INITIAL_LENGTH = 3;
const VIEWPORT_SIZE = (FIELD_SIZE + 10) * UNIT_SIZE;
const SCORE_PER_ORB = 10;

export class PlayerScript extends Script {
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private scene: Scene;
  private currentDirection: { x: number; y: number };
  private nextDirection: { x: number; y: number };
  private movementTimeout: number;
  private gameOver: boolean;
  private newSegment: boolean;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;
    this.scene = options.scene;
    this.currentDirection = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.movementTimeout = MOVEMENT_RATE;
    this.gameOver = false;
    this.newSegment = false;

    for (let i = 0; i < INITIAL_LENGTH; i += 1) {
      const segment = this.actorSpawner.spawn(SNAKE_SEGMENT_ID);
      const transform = segment.getComponent(Transform);
      const segmentComponent = segment.getComponent(SnakeSegment);

      transform.offsetX = -i * UNIT_SIZE;

      segmentComponent.index = i;

      this.actor.appendChild(segment);
    }

    this.actor.addEventListener(EventType.MovementDirection, this.handleMovementDirection);
    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.MovementDirection, this.handleMovementDirection);
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleMovementDirection = (event: MovementDirectionEvent): void => {
    const { x, y } = event;

    if (this.currentDirection.x === -x && this.currentDirection.y === -y) {
      return;
    }

    this.nextDirection.x = x;
    this.nextDirection.y = y;
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (actor.getComponent(Orb)) {
      this.newSegment = true;
      actor.remove();
      return;
    }

    this.scene.dispatchEvent(EventType.GameOver, { isWin: false });
    this.gameOver = true;

    while (this.actor.children.length > 0) {
      this.actor.children.at(-1)?.remove();
    }
  };

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.min(camera.windowSizeX / VIEWPORT_SIZE, camera.windowSizeY / VIEWPORT_SIZE);
  }

  private addNewSegment(position: { x: number; y: number }): void {
    const segments = this.actor.children.filter((child) => child.getComponent(SnakeSegment));

    const segment = this.actorSpawner.spawn(SNAKE_SEGMENT_ID);
    const segmentComponent = segment.getComponent(SnakeSegment);
    const segmentTransform = segment.getComponent(Transform);

    segmentComponent.index = segments.length;

    segmentTransform.offsetX = position.x;
    segmentTransform.offsetY = position.y;

    this.actor.appendChild(segment);

    const score = this.actor.getComponent(Score);
    score.value += SCORE_PER_ORB;
  }

  update(options: UpdateOptions): void {
    this.updateZoom();

    const { deltaTime } = options;

    if (this.gameOver) {
      return;
    }

    this.movementTimeout -= deltaTime;

    if (this.movementTimeout >= 0) {
      return;
    }

    const segments = this.actor.children.filter((child) => child.getComponent(SnakeSegment));
    segments.sort((a, b) => {
      const aSegment = a.getComponent(SnakeSegment);
      const bSegment = b.getComponent(SnakeSegment);

      return aSegment.index - bSegment.index;
    });

    const head = segments[0];
    const headTransform = head.getComponent(Transform);

    const prevPosition = { x: headTransform.offsetX, y: headTransform.offsetY };

    headTransform.offsetX += UNIT_SIZE * this.nextDirection.x;
    headTransform.offsetY += UNIT_SIZE * this.nextDirection.y;

    this.currentDirection.x = this.nextDirection.x;
    this.currentDirection.y = this.nextDirection.y;

    for (let i = 1; i < segments.length; i += 1) {
      const transform = segments[i].getComponent(Transform);

      [transform.offsetX, prevPosition.x] = [prevPosition.x, transform.offsetX];
      [transform.offsetY, prevPosition.y] = [prevPosition.y, transform.offsetY];
    }

    if (this.newSegment) {
      this.addNewSegment(prevPosition);
      this.newSegment = false;
    }

    this.movementTimeout = MOVEMENT_RATE;
  }
}

PlayerScript.scriptName = 'PlayerScript';
