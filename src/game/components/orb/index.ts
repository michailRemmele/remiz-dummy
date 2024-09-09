import { Component } from 'remiz';

export class Orb extends Component {
  clone(): Orb {
    return new Orb();
  }
}

Orb.componentName = 'Orb';
