import type { Reference } from 'remiz-editor';

import {
  MovementDirection,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    MovementDirection,
  ].map((value) => ({ title: value, value })),
};
