import { ScriptSystem } from 'remiz';

import {
  PlayerScript,
} from '../../../src/game/scripts';

import {
  playerScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [PlayerScript.scriptName]: playerScript,
  },
};
