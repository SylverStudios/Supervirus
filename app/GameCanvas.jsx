import React, { Component } from 'react';
import game from '../game/main';

export default class GameCanvas extends Component {
  componentDidMount() {
    game(this.canvas);
  }
  render() {
    return <canvas ref={(c) => { this.canvas = c; }} width="800" height="600" />;
  }
}
