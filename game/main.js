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

  let playerVelocityX = 0;
  let playerVelocityY = 0;
  let pressingArrowUp = false;
  let pressingArrowDown = false;
  let pressingArrowLeft = false;
  let pressingArrowRight = false;
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        pressingArrowUp = true;
        break;
      case 'ArrowDown':
        pressingArrowDown = true;
        break;
      case 'ArrowLeft':
        pressingArrowLeft = true;
        break;
      case 'ArrowRight':
        pressingArrowRight = true;
        break;
      default:
    }
  });
  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        pressingArrowUp = false;
        break;
      case 'ArrowDown':
        pressingArrowDown = false;
        break;
      case 'ArrowLeft':
        pressingArrowLeft = false;
        break;
      case 'ArrowRight':
        pressingArrowRight = false;
        break;
      default:
    }
  });

  const frameRate = 60; // frames per second
  const frameDuration = 1000 / frameRate; // in millis
  function mainLoop() {
    const frameStartTime = (new Date()).getTime();

    // compute velocity
    const acceleration = 7.5; // velocity change per second when player is moving
    const accelerationPerFrame = acceleration / frameRate;
    const maxSpeed = 180; // displacement per second (per dimension)
    const maxSpeedPerFrame = maxSpeed / frameRate;
    if (pressingArrowUp) {
      playerVelocityY -= accelerationPerFrame;
    } else if (pressingArrowDown) {
      playerVelocityY += accelerationPerFrame;
    }
    if (pressingArrowLeft) {
      playerVelocityX -= accelerationPerFrame;
    } else if (pressingArrowRight) {
      playerVelocityX += accelerationPerFrame;
    }
    playerVelocityY = Math.min(playerVelocityY, maxSpeedPerFrame);
    playerVelocityY = Math.max(playerVelocityY, -maxSpeedPerFrame);
    playerVelocityX = Math.min(playerVelocityX, maxSpeedPerFrame);
    playerVelocityX = Math.max(playerVelocityX, -maxSpeedPerFrame);

    // player stays in middle of screen, so move origin instead of player
    originX -= playerVelocityX;
    originY -= playerVelocityY;
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
