/* eslint-disable no-undef */
const virusSpritePath = require('../assets/virus_256x256.png');
const backgroundImagePath = require('../assets/petri_plaincircle_withgrid.png');

export default function Game(canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const context = canvas.getContext('2d');

  const virusImage = new Image();
  virusImage.onload = () => context.drawImage(virusImage, 10, 10);
  virusImage.src = virusSpritePath;

  const backgroundImage = new Image();
  const backgroundImageStartingSize = 1200;
  const backgroundImageStartingX = (canvasWidth / 2) - (backgroundImageStartingSize / 2);
  const backgroundImageStartingY = (canvasHeight / 2) - (backgroundImageStartingSize / 2);
  backgroundImage.onload = () => (
    context.drawImage(
      backgroundImage,
      backgroundImageStartingX,
      backgroundImageStartingY,
      backgroundImageStartingSize,
      backgroundImageStartingSize,
    )
  );
  backgroundImage.src = backgroundImagePath;
}
