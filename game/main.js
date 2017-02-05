import images, { allImagesLoaded } from './images';
import config from './config';

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

  drawBackground(context, originX, originY, config.backgroundImageStartingSize);

  drawVirus(context, canvasMiddleX, canvasMiddleY, config.virusStartingSize);

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

  const frameDuration = 1000 / config.frameRate; // in millis
  const accelerationPerFrame = config.acceleration / config.frameRate;
  // when player moves in opposite direction than already moving
  const activeDecelerationPerFrame = accelerationPerFrame * 2;
  // when there is no player input and player is currently moving, should slow down
  const passiveDecelerationPerFrame = accelerationPerFrame / 2;
  const maxSpeedPerFrame = config.maxSpeed / config.frameRate;
  function mainLoop() {
    const frameStartTime = (new Date()).getTime();

    // compute velocity
    if (pressingArrowUp) {
      if (playerVelocityY < 0) { // already moving up
        playerVelocityY -= accelerationPerFrame;
      } else { // currently moving down, so provide more acceleration up
        playerVelocityY -= activeDecelerationPerFrame;
      }
    } else if (pressingArrowDown) {
      if (playerVelocityY > 0) {
        playerVelocityY += accelerationPerFrame;
      } else {
        playerVelocityY += activeDecelerationPerFrame;
      }
    } else if (playerVelocityY > 0) { // no player input, passively decelerate if currently moving
      playerVelocityY -= passiveDecelerationPerFrame;
      playerVelocityY = Math.max(playerVelocityY, 0);
    } else if (playerVelocityY < 0) {
      playerVelocityY += passiveDecelerationPerFrame;
      playerVelocityY = Math.min(playerVelocityY, 0);
    }
    if (pressingArrowLeft) {
      if (playerVelocityX < 0) {
        playerVelocityX -= accelerationPerFrame;
      } else {
        playerVelocityX -= activeDecelerationPerFrame;
      }
    } else if (pressingArrowRight) {
      if (playerVelocityX > 0) {
        playerVelocityX += accelerationPerFrame;
      } else {
        playerVelocityX += activeDecelerationPerFrame;
      }
    } else if (playerVelocityX > 0) {
      playerVelocityX -= passiveDecelerationPerFrame;
      playerVelocityX = Math.max(playerVelocityX, 0);
    } else if (playerVelocityX < 0) {
      playerVelocityX += passiveDecelerationPerFrame;
      playerVelocityX = Math.min(playerVelocityX, 0);
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
    drawBackground(context, originX, originY, config.backgroundImageStartingSize);
    drawVirus(context, canvasMiddleX, canvasMiddleY, config.virusStartingSize);

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
