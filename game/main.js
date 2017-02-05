const virusSprite = require('../assets/virus_256x256.png');

export default function Game(canvas) {
  const context = canvas.getContext('2d');
  const image = new Image(); // eslint-disable-line no-undef
  image.onload = () => context.drawImage(image, 10, 10);
  image.src = virusSprite;
}
