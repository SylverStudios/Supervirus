import images, { allImagesLoaded } from './images';

function drawBackground(context, originX, originY, size) {
  context.drawImage(
    images.background,
    originX - (size / 2),
    originY - (size / 2),
    size,
    size,
  );
}

function drawVirus(context, canvasMiddleX, canvasMiddleY, size) {
  context.drawImage(
    images.virus,
    canvasMiddleX - (size / 2),
    canvasMiddleY - (size / 2),
    size,
    size,
  );
}

function initGame(canvas) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const canvasMiddleX = canvasWidth / 2;
  const canvasMiddleY = canvasHeight / 2;
  let originX = canvasMiddleX;
  let originY = canvasMiddleY;

  const context = canvas.getContext('2d');

  const backgroundImageStartingSize = 1200;
  drawBackground(context, originX, originY, backgroundImageStartingSize);

  const virusStartingSize = 32;
  drawVirus(context, canvasMiddleX, canvasMiddleY, virusStartingSize);

  // TODO obviously these shouldn't be constant
  const playerVelocityX = -2;
  const playerVelocityY = -2;

  const frameRate = 60; // frames per second
  const frameDuration = 1000 / frameRate; // in millis
  function mainLoop() {
    const frameStartTime = (new Date()).getTime();

    // player stays in middle of screen, so move origin instead of player
    originX += playerVelocityX;
    originY += playerVelocityY;
    // update all non-player images wrt new origin
    // clear everything
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackground(context, originX, originY, backgroundImageStartingSize);
    drawVirus(context, canvasMiddleX, canvasMiddleY, virusStartingSize);

    const frameEndTime = (new Date()).getTime();
    const thisFrameDuration = frameEndTime - frameStartTime;
    const waitTilNextFrame = Math.max(frameDuration - thisFrameDuration, 0);
    setTimeout(mainLoop, waitTilNextFrame);
  }
  mainLoop();
}

export default function Game(canvas) {
  allImagesLoaded.then(() => initGame(canvas));
}
