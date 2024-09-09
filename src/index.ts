import {
  Engine,

  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  PhysicsSystem,
  SpriteRenderer,
  ScriptSystem,
  UiBridge,
  GameStatsMeter,

  Camera,
  KeyboardControl,
  ColliderContainer,
  Sprite,
  Transform,
  ScriptBundle,
} from 'remiz';

import * as GameSystems from './game/systems';
import * as GameComponents from './game/components';
import * as GameScripts from './game/scripts';
import { isTouchDevice } from './utils/is-touch-device';
import { applyIosSafariScreenFix } from './utils/ios-screen-fix';
import { isIos } from './utils/is-ios';

import config from '../data/data.json';

const touchDevice = isTouchDevice();

const engine = new Engine({
  config,
  systems: [
    CameraSystem,
    PhysicsSystem,
    SpriteRenderer,
    UiBridge,
    ScriptSystem,
    GameStatsMeter,
    ...(!touchDevice
      ? [
        KeyboardInputSystem,
        KeyboardControlSystem,
      ]
      : []
    ),
    ...Object.values(GameSystems),
  ],
  components: [
    Camera,
    KeyboardControl,
    ColliderContainer,
    Sprite,
    Transform,
    ScriptBundle,
    ...Object.values(GameComponents),
  ],
  resources: {
    [ScriptSystem.systemName]: [
      ...Object.values(GameScripts),
    ],
    [UiBridge.systemName]: {
      // comment: to avoid eslint issues with extensions
      // eslint-disable-next-line import/extensions
      loadUiApp: () => import('./ui/index.tsx'),
    },
  },
});

void engine.play();

if (isIos()) {
  applyIosSafariScreenFix();
}
