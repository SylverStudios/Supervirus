// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {

	Game.startUp = true;

	Crafty.e('Boundary');
	Crafty.e('PlayerCharacter');
	Crafty.e('MobArray');
	for (var i = 0 ; i < 30 ; i++) {
		Crafty('MobArray').add(Crafty.e('PassiveMob'));
		// Crafty('MobArray').get(i)._w = 10 + 2*i;
		// Crafty('MobArray').get(i)._h = 10 + 2*i;
		// Crafty('MobArray').get(i).redrawHitCircle();
	}
	Crafty.e('HeadsUpDisplay');
	Crafty('PlayerCharacter').attach(Crafty('HeadsUpDisplay'));

	Game.startUp = false;

	Crafty.bind('MobRemoved', this.checkIfWon);

	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('MobRemoved', function() {
		if (Crafty('MobArray').length() == 0) {
			Crafty.scene('Victory');
		}
	});
}, function() {
	//do things after the scene above goes
});

// Victory scene
// -------------
// To be shown when the player wins the game
Crafty.scene('Victory', function() {

	Crafty.viewport.scroll('_x', 0 );
	Crafty.viewport.scroll('_y', 0 );

	Crafty.e('VictoryImage');
});

Crafty.scene('Defeat', function() {

	Crafty.viewport.scroll('_x', 0 );
	Crafty.viewport.scroll('_y', 0 );

	Crafty.e('DefeatImage');

	Crafty.e('2D, DOM, Text')
	.text('your score wuz ' + Game.score + '...press space to reload')
	.attr({ x: 0, y: Game.height - 80, w: Game.width })
	.css($text_css);

	// After a short delay, watch for the player to press a key, then restart
  // the game when a key is pressed
  this.restart_game = Crafty.bind('KeyDown', function(e) {
  	if( e.keyCode == 32 ) location.reload();
  });
}, function() {
  // Remove our event binding from above so that we don't
  //  end up having multiple redundant event watchers after
  //  multiple restarts of the game
  this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){

	// prevent scrolling with arrow keys
	var ar=new Array(32,33,34,35,36,37,38,39,40);

	$(document).keydown(function(e) {
		var key = e.which;
      //console.log(key);
      //if(key==35 || key == 36 || key == 37 || key == 39)
      if($.inArray(key,ar) > -1) {
      	e.preventDefault();
      	return false;
      }
      return true;
  });
	// Draw some text for the player to see in case the file
	//  takes a noticeable amount of time to load
	Crafty.e('2D, DOM, Text')
	.text('Loading; please wait...')
	.attr({ x: 0, y: Game.height/2 - 24, w: Game.width })
	.css($text_css);


	// Load our sprite map image
	Crafty.load([
		'assets/defeatimage.png',
		'assets/passivemob_256x256.png',
		'assets/virus_256x256.png',
		'assets/petri_plaincircle.png',
		'assets/victoryimage.png'
		], function(){

			Crafty.sprite(256, 'assets/virus_256x256.png', {
				spr_player: [0, 0]
			});

			Crafty.sprite(256, 'assets/passivemob_256x256.png', {
				spr_mob: [0, 0]
			});

			Crafty.sprite(580, 'assets/petri_plaincircle.png', {
				spr_boundary: [0, 0]
			});

			Crafty.sprite(256, 'assets/victoryimage.png', {
				spr_victory: [0, 0]
			});

			Crafty.sprite(256, 'assets/defeatimage.png', {
				spr_defeat: [0, 0]
			});

			Crafty.scene('Game');

		})
});
