import {
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { FC } from 'react';
import { Vector2 } from 'remiz';

import './style.css';

type StickPosition = {
  areaRadius: number
  areaX: number
  areaY: number
  observerX: number
  observerY: number
};

export type ThumbStickProps = {
  className?: string
  align?: 'left' | 'right'
  onMove: (x: number, y: number) => void
};

export const ThumbStick: FC<ThumbStickProps> = ({ className, align = 'left', onMove }) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  const pointerIdRef = useRef<number>();

  const stickPositionRef = useRef<StickPosition>({
    areaRadius: 0,
    areaX: 0,
    areaY: 0,
    observerX: 0,
    observerY: 0,
  });

  const updateArea = useCallback((): void => {
    if (!areaRef.current || !observerRef.current) {
      return;
    }

    const {
      left, right, top, bottom, width,
    } = areaRef.current.getBoundingClientRect();
    const {
      left: observerX, top: observerY,
    } = observerRef.current.getBoundingClientRect();

    stickPositionRef.current = {
      areaRadius: width / 2,
      areaX: (left + right) / 2,
      areaY: (top + bottom) / 2,
      observerX,
      observerY,
    };
  }, []);

  const moveStick = useCallback((event: React.PointerEvent | PointerEvent): void => {
    const { areaX, areaY, areaRadius } = stickPositionRef.current;

    const direction = new Vector2(event.clientX - areaX, event.clientY - areaY);
    const { magnitude } = direction;

    if (magnitude > areaRadius) {
      direction.multiplyNumber(areaRadius / magnitude);
    }

    if (controlRef.current) {
      controlRef.current.style.transform = `translateX(${Math.floor(direction.x)}px) translateY(${Math.floor(direction.y)}px)`;
    }

    direction.multiplyNumber(1 / areaRadius);

    onMove(direction.x, direction.y);
  }, [onMove]);

  const resetStick = useCallback((): void => {
    if (areaRef.current) {
      areaRef.current.style.left = '';
      areaRef.current.style.top = '';
    }
    if (controlRef.current) {
      controlRef.current.style.transform = '';
    }

    updateArea();

    onMove(0, 0);
  }, [updateArea, onMove]);

  const onPointerMove = useCallback((event: PointerEvent): void => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    moveStick(event);
  }, [moveStick]);

  const onPointerDown = useCallback((event: React.PointerEvent): void => {
    const { areaRadius, observerX, observerY } = stickPositionRef.current;
    const { clientX, clientY } = event;

    if (pointerIdRef.current) {
      return;
    }

    pointerIdRef.current = event.pointerId;

    const left = clientX - observerX - areaRadius;
    const top = clientY - observerY - areaRadius;

    if (areaRef.current) {
      areaRef.current.style.left = `${left}px`;
      areaRef.current.style.top = `${top}px`;
    }

    updateArea();

    observerRef.current?.setPointerCapture(event.pointerId);
    observerRef.current?.addEventListener('pointermove', onPointerMove);

    moveStick(event);
  }, [updateArea, onPointerMove, moveStick]);

  const onPointerUp = useCallback((event: React.PointerEvent): void => {
    if (pointerIdRef.current !== event.pointerId) {
      return;
    }

    pointerIdRef.current = undefined;

    observerRef.current?.removeEventListener('pointermove', onPointerMove);

    resetStick();
  }, [onPointerMove, resetStick]);

  useEffect(() => {
    updateArea();

    window.addEventListener('resize', updateArea);

    return (): void => {
      window.removeEventListener('resize', updateArea);

      observerRef.current?.removeEventListener('pointermove', onPointerMove);
      onMove(0, 0);
    };
  }, [updateArea]);

  return (
    <div
      ref={observerRef}
      className={`thumb-stick-observer ${className}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        ref={areaRef}
        className={`thumb-stick thumb-stick_${align}`}
      >
        <div
          ref={controlRef}
          className="thumb-stick__control"
        />
      </div>
    </div>
  );
};
