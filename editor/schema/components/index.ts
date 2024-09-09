import type { WidgetSchema } from 'remiz-editor';

import {
  Orb,
  SnakeSegment,
  Score,
} from '../../../src/game/components';

import { orb } from './orb';
import { snakeSegment } from './snake-segment';
import { score } from './score';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Orb.componentName]: orb,
  [SnakeSegment.componentName]: snakeSegment,
  [Score.componentName]: score,
};
