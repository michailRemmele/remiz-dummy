import { Component } from 'remiz';

export class Score extends Component {
  value: number;

  constructor() {
    super();

    this.value = 0;
  }

  clone(): Score {
    return new Score();
  }
}

Score.componentName = 'Score';
