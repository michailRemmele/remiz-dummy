import type { WidgetSchema } from 'remiz-editor';

import { OrbSpawner } from '../../../src/game/systems';

import { orbSpawner } from './orb-spawner';

export const systemsSchema: Record<string, WidgetSchema> = {
  [OrbSpawner.systemName]: orbSpawner,
};
