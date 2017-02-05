/* eslint-disable no-undef */
const virusSpritePath = require('../assets/virus_256x256.png');
const backgroundImagePath = require('../assets/petri_plaincircle_withgrid.png');

export default function Game(canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const canvasMiddleX = canvasWidth / 2;
  const canvasMiddleY = canvasHeight / 2;

  const context = canvas.getContext('2d');

  const backgroundImage = new Image();
  const backgroundImageStartingSize = 1200;
  const backgroundImageStartingX = canvasMiddleX - (backgroundImageStartingSize / 2);
  const backgroundImageStartingY = canvasMiddleY - (backgroundImageStartingSize / 2);
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

  const virusImage = new Image();
  const virusStartingSize = 32;
  const virusStartingX = canvasMiddleX - (virusStartingSize / 2);
  const virusStartingY = canvasMiddleY - (virusStartingSize / 2);
  virusImage.onload = () => (
    context.drawImage(
      virusImage,
      virusStartingX,
      virusStartingY,
      virusStartingSize,
      virusStartingSize,
    )
  );
  virusImage.src = virusSpritePath;
}
