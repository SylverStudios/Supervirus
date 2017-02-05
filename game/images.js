const images = {};
const promises = [];

function loadImage(name, src) {
  images[name] = new Image();
  let imageHasLoaded;
  const promise = new Promise((resolve) => { imageHasLoaded = resolve; });
  promises.push(promise);
  images[name].onload = () => imageHasLoaded();
  images[name].src = src;
}

loadImage('background', require('../assets/petri_plaincircle_withgrid.png'));
loadImage('virus', require('../assets/virus_256x256.png'));

export const allImagesLoaded = Promise.all(promises);
export default images;
