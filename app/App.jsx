import React from 'react';
import styles from './App.scss';

import GameCanvas from './GameCanvas';

const App = () => (
  <div>
    <h2 className={styles.header}>Supervirus</h2>
    <p className={styles.controls}>
      Controls: Arrow Keys. Hit things smaller than you and avoid
      things larger than you. Godspeed.
    </p>
    <div className={styles.canvasContainer}>
      <GameCanvas />
    </div>
    <p className={styles.bottom}>
      Development of game Supervirus by Sylver Studios
    </p>
  </div>
);

export default App;
