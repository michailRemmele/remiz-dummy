import {
  Scene,
  ActorCollection,
  MathOps,
  System,
  Transform,
} from 'remiz';
import type {
  SystemOptions,
  ActorSpawner,
} from 'remiz';
import { RemoveActor } from 'remiz/events';

import { Orb, SnakeSegment } from '../../components';
import {
  FIELD_SIZE,
  UNIT_SIZE,
} from '../../../consts/game';
import { ORB_ID } from '../../../consts/templates';
import * as EventType from '../../events';

const MIN_POS = -Math.ceil(FIELD_SIZE / 2) + 1;
const MAX_POS = Math.ceil(FIELD_SIZE / 2) - 1;

export class OrbSpawner extends System {
  private actorCollection: ActorCollection;
  private segmentsCollection: ActorCollection;
  private actorSpawner: ActorSpawner;
  private scene: Scene;
  private isOrbSpawned: boolean;

  constructor(options: SystemOptions) {
    super();

    this.actorCollection = new ActorCollection(options.scene, {
      components: [Orb],
    });
    this.segmentsCollection = new ActorCollection(options.scene, {
      components: [SnakeSegment],
    });
    this.actorSpawner = options.actorSpawner;
    this.scene = options.scene;
    this.isOrbSpawned = false;
  }

  mount(): void {
    this.actorCollection.addEventListener(RemoveActor, this.handleRemoveActor);
    this.scene.addEventListener(EventType.GameOver, this.handleGameOver);
  }

  unmount(): void {
    this.actorCollection.removeEventListener(RemoveActor, this.handleRemoveActor);
    this.scene.removeEventListener(EventType.GameOver, this.handleGameOver);
  }

  private handleRemoveActor = (): void => {
    this.isOrbSpawned = false;
  };

  private handleGameOver = (): void => {
    this.actorCollection.forEach((actor) => actor.remove());
  };

  update(): void {
    if (this.isOrbSpawned || this.segmentsCollection.size === 0) {
      return;
    }

    const unavailablePositions: Record<number, Set<number>> = {};
    this.segmentsCollection.forEach((actor) => {
      const transform = actor.getComponent(Transform);
      unavailablePositions[transform.offsetX] ??= new Set();
      unavailablePositions[transform.offsetX].add(transform.offsetY);
    });

    const availablePositions: [number, number][] = [];
    for (let x = MIN_POS * UNIT_SIZE; x <= MAX_POS * UNIT_SIZE; x += UNIT_SIZE) {
      for (let y = MIN_POS * UNIT_SIZE; y <= MAX_POS * UNIT_SIZE; y += UNIT_SIZE) {
        if (!unavailablePositions[x]?.has(y)) {
          availablePositions.push([x, y]);
        }
      }
    }

    const orb = this.actorSpawner.spawn(ORB_ID);
    const transform = orb.getComponent(Transform);

    const [x, y] = availablePositions[MathOps.random(0, availablePositions.length - 1)];
    transform.offsetX = x;
    transform.offsetY = y;

    this.scene.appendChild(orb);

    this.isOrbSpawned = true;
  }
}

OrbSpawner.systemName = 'OrbSpawner';
