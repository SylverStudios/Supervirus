export function colliding(
  center1X,
  center1Y,
  center2X,
  center2Y,
  hitCircleRadius1,
  hitCircleRadius2,
) {
  const distanceBetweenCenters = Math.sqrt(
    ((center2X - center1X) ** 2) +
    ((center2Y - center1Y) ** 2),
  );
  const radiiAdded = hitCircleRadius1 + hitCircleRadius2;
  const radiiSubtracted = Math.abs(hitCircleRadius2 - hitCircleRadius1);

  return distanceBetweenCenters < radiiAdded && distanceBetweenCenters > radiiSubtracted;
}
