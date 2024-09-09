import { Component } from 'remiz';

interface SnakeSegmentConfig {
  index: number
}

export class SnakeSegment extends Component {
  index: number;

  constructor(config: SnakeSegmentConfig) {
    super();

    this.index = config.index;
  }

  clone(): SnakeSegment {
    return new SnakeSegment({ index: this.index });
  }
}

SnakeSegment.componentName = 'SnakeSegment';
