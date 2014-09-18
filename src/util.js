Util = {
	
	// returns slope given the components of a vector. NOTE: Y-component goes first.
	getSlope: function(rise, run) {
		var slope;
		if (run === 0 && rise > 0)
		slope = Math.pow(2, 53); // Largest Integer
		else if( run === 0 && rise < 0)
		slope = Math.pow(-2, 53);
		else slope = rise / run;
		return slope;
	},
	
	// returns the dot product of two arrays of vector components
	dotProduct: function(firstComponents, secondComponents) {
		if( !firstComponents instanceof Array || !secondComponents instanceof Array ) {
			console.error("did not pass function \'dotProduct\' two arrays");
			return null;
		}
		if( firstComponents.length != secondComponents.length ) {
			console.error("did not pass function \'dotProduct\' two arrays of equal length");
			return null;
		}
		var dotProduct = 0;
		for ( var i = 0 ; i < firstComponents.length ; i++ ) {
			dotProduct += firstComponents[i]*secondComponents[i];
		}
		return dotProduct;
	},
	
	rectContainedInRect: function(rect2, rect1) {
		if (rect1.x < rect2.x && rect1.x+rect1.w > rect2.x+rect2.w && rect1.y < rect2.y && rect1.y+rect1.h > rect2.y+rect2.h) {
			return true;
		}
		else {
			return false;
		}
	}
	
};

function simulate(element, eventName) {

	var options = extend(defaultOptions, arguments[2] || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType) {
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
	}

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents')
		{
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else
		{
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
			options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
			options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	} else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}

	return element;

}

function extend(destination, source) {

	for (var property in source) {
		destination[property] = source[property];
	}

	return destination;

}

var eventMatchers = {
	'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};

var defaultOptions = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
};
