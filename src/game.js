Game = {
 
  // The total width of the game screen.
  width: 800,
 
  // The total height of the game screen. 
  height: 600,
  
  score: 0,
 
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width, Game.height);
    Crafty.background('white');
 
    // Simply start the "Loading" scene to get things going
    Crafty.scene('Loading');
  },
  
}
 
$text_css = {
  'font-size': '24px',
  'font-family': 'Arial',
  'color': 'black',
  'text-align': 'center'
}