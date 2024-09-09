import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { PLAYER_ID } from '../../../../../consts/actors';
import { EngineContext } from '../../../../providers';
import { Score } from '../../../../../game/components';

import './style.css';

export const ScoreBar: FC = () => {
  const { scene, gameStateObserver } = useContext(EngineContext);

  const [scoreValue, setScoreValue] = useState(0);

  useEffect(() => {
    const handleUpdate = (): void => {
      const player = scene.getEntityById(PLAYER_ID);
      const score = player?.getComponent(Score);

      setScoreValue(score?.value ?? 0);
    };

    gameStateObserver.subscribe(handleUpdate);
    return (): void => gameStateObserver.unsubscribe(handleUpdate);
  }, []);

  return (
    <div className="score-bar">
      {scoreValue}
    </div>
  );
};
