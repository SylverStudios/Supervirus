/* eslint-disable camelcase */

import { getSlope } from './MathUtils';
import images, { allImagesLoaded } from './images';
import config from './config';
import { computeActivity, computeVelocity } from './motion';

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
  const playerHitCircleRadius = config.virusStartingSize / 2;
  const boundaryHitCircleRadius =
    (config.backgroundImageStartingSize / 2) - (config.backgroundImageStartingSize / 58);
  function mainLoop() {
    const frameStartTime = (new Date()).getTime();

    // so that you never have to think about this again: in order to achieve (among other things)
    // bouncing off the boundary, there must be a difference between displacement and velocity.
    // consider perfectly inelastically bouncing off of a diagonal wall:
    //     '.
    //  o -->'.
    //       | '.
    //       v   '.
    // if all of that had to happen in the same frame due to high velocity, then the object o must
    // be displaced diagonally, but cannot have that vector as its velocity coming out of the frame.
    // the velocity must be pointing straight down.

    // naively (without considering collisions) compute velocity and position of origin after
    // velocity is appliedr
    const naivelyComputedVelocity = computeVelocity(
      playerVelocityX,
      playerVelocityY,
      computeActivity(pressingArrowLeft, pressingArrowRight),
      computeActivity(pressingArrowUp, pressingArrowDown),
      accelerationPerFrame,
      activeDecelerationPerFrame,
      passiveDecelerationPerFrame,
      maxSpeedPerFrame,
    );
    const naiveNextOriginX = originX - naivelyComputedVelocity.x;
    const naiveNextOriginY = originY - naivelyComputedVelocity.y;

    // consider all geometry as if origin were (0, 0) and y wasn't inverted
    const x_p = -originX + canvasMiddleX; // x position of player
    const y_p = originY - canvasMiddleY; // y position of player
    const velocityX = naivelyComputedVelocity.x;
    const velocityY = -naivelyComputedVelocity.y;

    // get equation of line described by velocity
    const m_v = getSlope(velocityY, velocityX); // slope of velocity line
    // y - y1 = m(x - x1)
    // y - y_p = m_v(x - x_p)
    // y = m_v(x - x_p) + y_p
    // y - y_p = (m_v * x) - (m_v * x_p)
    // y = (m_v * x) - (m_v * x_p) + y_p
    const b_v = -(m_v * x_p) + y_p; // the 'b' in y = mx + b
    // y = (m_v * x) + b_v

    // hitBoundary is the circle that the origin of the player circle would lie on when colliding
    // get equation of hitBoundary circle
    const r_hb = boundaryHitCircleRadius - playerHitCircleRadius; // radius of hit boundary
    // d = sqrt(x^2 + y^2)
    // r_hb = sqrt(x^2 + y^2)
    // r_hb^2 = x^2 + y^2
    // x^2 + y^2 - r_hb^2 = 0

    // find points of intersection btwn hitBoundary and velocity line
    // x^2 + ((m_v * x) + b_v)^2 - r_hb^2 = 0
    // x^2 + (m_v * x)^2 + 2(m_v * b_v * x) + b_v^2 - r_hb^2 = 0
    // (m_v^2 + 1)x^2 + (2 * m_v * b_v)x + b_v^2 - r_hb^2 = 0
    const a_q = (m_v ** 2) + 1; // coefficient of x^2 (the 'a' in quadratic formula)
    const b_q = 2 * m_v * b_v; // coefficient of x (the 'b' in quadratic formula)
    const c_q = (b_v ** 2) - (r_hb ** 2); // constant (the 'c' in quadratic formula)
    // plug into quadratic formula
    // x = (-b_q +/- sqrt(b_q^2 - 4 * a_q * c_q)) / (2 * a_q)
    const x_q_1 = (-b_q + Math.sqrt((b_q ** 2) - (4 * a_q * c_q))) / (2 * a_q);
    const x_q_2 = (-b_q - Math.sqrt((b_q ** 2) - (4 * a_q * c_q))) / (2 * a_q);
    // plug each back into line formula to get y coordinates
    const y_q_1 = (m_v * x_q_1) + b_v;
    const y_q_2 = (m_v * x_q_2) + b_v;

    // determine which point is in the direction of vector (the other is directly backwards)
    // if velocityX and x_q - x_p have same sign
    const x_hb = Math.sign(velocityX) === Math.sign(x_q_1 - x_p) // x when player is on hitBoundary
      ? x_q_1
      : x_q_2;
    const y_hb = x_hb === x_q_1 // y when player is on hitBoundary
      ? y_q_1
      : y_q_2;

    // if magnitude of velocity is greater than distance between player and (x_hb, y_hb), player
    // will collide with boundary this frame
    const magnitudeOfVelocity = Math.sqrt((velocityX ** 2) + (velocityY ** 2));
    const distanceToHitBoundary = Math.sqrt(((x_hb - x_p) ** 2) + ((y_hb - y_p) ** 2));
    const playerWouldCollideWithBoundary = magnitudeOfVelocity >= distanceToHitBoundary;
    if (playerWouldCollideWithBoundary) {
      console.log('will collide this frame!');
    }

    originX = naiveNextOriginX;
    originY = naiveNextOriginY;
    playerVelocityX = naivelyComputedVelocity.x;
    playerVelocityY = naivelyComputedVelocity.y;
    // update all non-player images wrt new origin
    // clear everything
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawBackground(context, originX, originY, config.backgroundImageStartingSize);
    drawVirus(context, canvasMiddleX, canvasMiddleY, config.virusStartingSize);

    // FOR DEBUGGING
    // draw velocity line
    const lineX1 = -1000;
    const lineX2 = 1000;
    const lineY1 = (m_v * lineX1) + b_v;
    const lineY2 = (m_v * lineX2) + b_v;
    context.strokeStyle = '#0000FF';
    context.beginPath();
    context.moveTo(lineX1 + originX, -lineY1 + originY);
    context.lineTo(lineX2 + originX, -lineY2 + originY);
    context.stroke();
    context.closePath();
    // draw hitBoundary
    context.strokeStyle = '#003300';
    context.beginPath();
    context.arc(originX, originY, r_hb, 0, 2 * Math.PI, false);
    context.lineWidth = 3;
    context.stroke();
    context.closePath();
    // draw points of intersection btwn velocity line and hitBoundary
    context.beginPath();
    context.arc(x_q_1 + originX, -y_q_1 + originY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#FFF';
    context.fill();
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(x_q_2 + originX, -y_q_2 + originY, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#FFF';
    context.fill();
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

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
