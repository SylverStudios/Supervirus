const POSITIVE = Symbol('POSITIVE DIRECTION');
const NEGATIVE = Symbol('NEGATIVE DIRECTION');
const NONE = Symbol('NO DIRECTION');
export const DIRECTION = { POSITIVE, NEGATIVE, NONE };

export function computeActivity(negativeImpetus, positiveImpetus) {
  let activity = DIRECTION.NONE;
  if (negativeImpetus) {
    activity = DIRECTION.NEGATIVE;
  } else if (positiveImpetus) {
    activity = DIRECTION.POSITIVE;
  }
  return activity;
}

function computeDimensionVelocity(
  startingVelocity,
  activity,
  accelerationPerFrame,
  activeDecelerationPerFrame,
  passiveDecelerationPerFrame,
  maxSpeedPerFrame,
) {
  let velocity = startingVelocity;
  if (activity === NEGATIVE) {
    if (velocity < 0) {
      velocity -= accelerationPerFrame;
    } else {
      velocity -= activeDecelerationPerFrame;
    }
  } else if (activity === POSITIVE) {
    if (velocity > 0) {
      velocity += accelerationPerFrame;
    } else {
      velocity += activeDecelerationPerFrame;
    }
  } else if (velocity > 0) {
    velocity -= passiveDecelerationPerFrame;
    velocity = Math.max(velocity, 0);
  } else if (velocity < 0) {
    velocity += passiveDecelerationPerFrame;
    velocity = Math.min(velocity, 0);
  }
  velocity = Math.min(velocity, maxSpeedPerFrame);
  velocity = Math.max(velocity, -maxSpeedPerFrame);
  return velocity;
}

export function computeVelocity(
  startingVelocityX,
  startingVelocityY,
  activityX,
  activityY,
  accelerationPerFrame,
  activeDecelerationPerFrame,
  passiveDecelerationPerFrame,
  maxSpeedPerFrame,
) {
  return {
    x: computeDimensionVelocity(
      startingVelocityX,
      activityX,
      accelerationPerFrame,
      activeDecelerationPerFrame,
      passiveDecelerationPerFrame,
      maxSpeedPerFrame,
    ),
    y: computeDimensionVelocity(
      startingVelocityY,
      activityY,
      accelerationPerFrame,
      activeDecelerationPerFrame,
      passiveDecelerationPerFrame,
      maxSpeedPerFrame,
    ),
  };
}
