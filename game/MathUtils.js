export function getSlope(rise, run) {
  let slope;
  if (run === 0 && rise > 0) {
    slope = 2 ** 53; // Largest Integer
  } else if (run === 0 && rise < 0) {
    slope = (-2) ** 53;
  } else {
    slope = rise / run;
  }
  return slope;
}

// returns the dot product of two arrays of vector components
export function dotProduct(firstComponents, secondComponents) {
  if (!(firstComponents instanceof Array) || !(secondComponents instanceof Array)) {
    console.error('did not pass function \'dotProduct\' two arrays');
    return null;
  }
  if (firstComponents.length !== secondComponents.length) {
    console.error('did not pass function \'dotProduct\' two arrays of equal length');
    return null;
  }
  let result = 0;
  for (let i = 0; i < firstComponents.length; i += 1) {
    result += firstComponents[i] * secondComponents[i];
  }
  return result;
}
