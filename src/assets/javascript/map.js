
/**
 * Geographic survey through Slovakia.
 * At least this time.
 */

(function(){
	// survey loaded already
	if(window._Survey) return;

	// original survey
	var _Survey;

	// store our copy of survey
	var _S = _Survey = window._Survey = function() {


		// default values - provisional
		return new init(
					document.getElementById('map'),
				document.getElementById('survey-labels'),
			document.getElementById('introduction')
		);
	};

	// initialization function
	var init;

	(function() {
		// private element references
		var
			// introduction first shown after visiting the page
			intro,

			// labels used during survey through the map
			labels,

			// the map the survey is being done on
			map
		;

		// initializes elements
		init = function( m, l, i ) { // this `init` is from outer scope ^
			intro = i, labels = l, map = m;
		}

		// set prototype of _Survey object
		init.prototype = _Survey.prototype = {
			// make sure that survey's constructor is survey itself
			constructor: _Survey,

			/**
			 * Clears current slide from images etc.
			 * and prepares it for fluent disappear.
			 */
			clear: function() {
				var map = document.getElementById('place-view'),
					len = map.childNodes.length;
				var removal = new Array();

				// first they disappear...
				for(var  im = 0; im < len; im++) {

					if(map.childNodes[im].hasOwnProperty('nodeName')
					&& map.childNodes[im].nodeName.toUpperCase() == 'IMG') {
						setClass(map.childNodes[im], 'appears', true);
						removal.push(map.childNodes[im])
					}
				}

				// ...and then
				window.setTimeout(function removeElementOnTimeout(elem){ // are removed

					if(elem) 															// if this is not the first call but recursive
						(elem.parentNode === map) && map.removeChild(elem); // remove element that we received
					if(!removal.length) return; 										// if there are no more elements
					removeElementOnTimeout(removal.shift()); 					// and invoke recursion with shifted element
				}, 750) // half and a quarter of the second

			},

			/**
			 * Starts a new survey.
			 * 
			 * @param  {array-like object} [ 0: { coordinates: [ x, y ], images: [ path, path... ] }, ...n: { ... } ]
			 */
			start: function(details) {
				if(typeof details !== 'object' || !details.length)
				{
					throw new TypeError("Given parameter MUST BE an array-like object, " + typeof(details) + " given.");
				}

				// store coordinates
				coordinates = (function(array){
					for(var p = [], i = 0, len = array.length; i < len; i++)  {
						p.push(array[i].coordinates);

						if(p.length === len) return p;
					}
				})(details);

				// store details object for later use
				data = details;

				setHidden(intro);
				setVisible(map);

				var k = 1.45, lbldst = document.getElementById('label');
				lbldst.style.width = (k * parseInt(this.width)).toString() + 'px';
				lbldst.style.height = (k * parseInt(this.height)).toString() + 'px';

				setVisible(lbldst);

				this.label = 1; // reset the label

				var instance = this; // this alternative

				// key handler
				window.onkeyup = function(e) {
					var event = window.event || e;

					if(event.keyCode == 39) {
						instance.next();
					}
				}

				// start presentation
				window.setTimeout(function() {
					instance.view.call(instance, 1);
				}, 1800);
			},

			stop: function() {
				this.clear();

				var map = document.getElementById('place-view');
				setClass(map, 'point-view', true); // reset to default state
				this.moveMap(0, 0);
				map.style.width = '100%';
				map.style.height = '100%';

				setHidden(document.getElementById('label'));
			},

			next: function() {
				if(this.label === coordinates.length) { // skip if there are no more coordinates
					this.stop();
					return;
				}

				this.clear();

				var map = document.getElementById('place-view');

				setClass(map, 'point-view', true);

				this.moveMap(0, 0);

				map.style.width = '100%';
				map.style.height = '100%';
				
				var instance = this;
				window.setTimeout(function() {
					instance.view.call(instance, ++instance.label);
				}, 2 * 1000); // 2 seconds
			},

			view: function( labelNo ) {
				var pos = coordinates[ (labelNo) - 1 ]; // 0 => x, 1 => y
				this.moveMap.apply(this, pos);

				var map = document.getElementById('place-view');
				setClass(map, 'point-view'); // apply transition

				map.style.width = this.width;
				map.style.height = this.height;

				/* add some related images */
				var images = (function(map, images) {
					var nodes = [ ], len;
					if( !(len = images.length) ) return;

					for(var i = 0; i < len; i++) {
						var img = document.createElement('img');
						img.src = (images[i].indexOf('://') < 6 && images[i].indexOf('://') > -1) ? images[i] : 'assets/images/details/' + images[i];
						nodes.push(img);
					}

					// compute dimensions
					for(var no in nodes) {
						var img = nodes[no],
							style = nodes[no].style,
							placeholder = {
								x: parseInt( map.style.width, 10 ),
								y: parseInt( map.style.height, 10)
							};

						switch(nodes.length) {
							case 2:
								style.width = (placeholder.x * 6 / 5 / 2).toString() + 'px';
								style.height = '100%';
								style.left = (no * placeholder.x / 2).toString() + 'px'; // this is trivial beacuse node index is either 0 or 1

								// set a callback to asynchronously set modified height and width properties
								img.onappear = (function(no){
									return function() {
										this.style.height = '120%'; 		// this makes it possible to leave image out
										this.style.marginTop = '-10%'; 	// of the parent element's "layer" using negative margin

										var k, nw, nh, im;
										(im = new Image()).src = this.src;
										nh = this.naturalHeight || im.height;
										nw = this.naturalWidth || im.width;
										k = nh / nw;

										this.style.width = (k * parseInt(window.getComputedStyle(this, null).height, 10)).toString() + 'px';
										this.style.left = (no == 0 ? -placeholder.x / 3 : placeholder.x * 2 / 3).toString() + 'px';
									};
								})(no);
								
								break;

							case 4: {
								style.width 	= (placeholder.x / 2).toString() + 'px';
								style.height 	= (placeholder.y / 2).toString() + 'px';

								// defaults
								style.left = style.top = '0px';

								if(no == 1 || no == 3) {
									style.left = style.width;
								} if(no == 2 || no == 3) { // but intentionally missing else
									style.top = style.height;
								}

								// set the same callback
								img.onappear = (function(no){
									var k = 1.2; // hardcoded

									return function() {
										//this.style.left = // intentionally
										//this.style.top = '0px';

										this.style.height = (k * parseInt(this.style.height, 10)).toString() + 'px';
										this.style.width = (k * parseInt(this.style.width, 10)).toString() + 'px';

										var moveX = parseInt(map.style.width, 		10) * (no % 2 > 0 ? 1 : -1) / 9;
										var moveY = parseInt(map.style.height, 	10) * (no > 1 ? 1 : -1) / 9;

										this.style.left = (parseInt(this.style.left, 10) + moveX).toString() + 'px';
										this.style.top = (parseInt(this.style.top, 10) + moveY).toString() + 'px';
									};
								})(no);

								break;
							}

							default:
								return;
						}

						map.appendChild(img);
						img.setAttribute && img.setAttribute('no', no);
					}

					return nodes;
				})(map, data[labelNo - 1].images);

				// images must "appear" - this applies CSS transition
				window.setTimeout(function() {
					for(im in images) {
						setClass(images[im], 'appears');

						if (typeof(images[im].onappear) === 'function')
							images[im].onappear.apply(images[im]);
					}
				}, 1120);

				/* show some labels about it */
				var label = labels.getElementsByTagName('dl')[0];
				label = function() {
					var h1 = label.getElementsByTagName('dt');

					for(var t = 0; t < h1.length; t++) {
						if(h1[t].getAttribute('data-poradie') === labelNo.toString())
							return h1[t];
					}

					throw new Error('Not enough labels');
				}();

				var theClass = label.className.split(' ')[0];
				label = [
					label, 															// the title label
					label.parentNode.getElementsByClassName(theClass)[1] 	// a list
				];

				// debug
				_d(label[0], label[1])

				// prepare label
				var lbldest = document.getElementById('label'); // #label
				lbldest.childNodes[0].innerHTML = label[0].innerHTML;
				lbldest.childNodes[1].innerHTML = label[1].innerHTML;
			},

			moveMap: function( x, y ) {
				var calcCoordinate = function(coordinate, clipDistance) {
					if(coordinate <= clipDistance / 2)
						return 0;
					return coordinate - clipDistance / 2;
				}

				x = calcCoordinate(x, this.width);
				y = calcCoordinate(y, this.height);

				var map = document.getElementById('place-view');

				map.style.backgroundPositionX = '-' + x.toString() + 'px';
				map.style.backgroundPositionY = '-' + y.toString() + 'px';

				// debug
				_d('moveMap():', x, y, map)
			},

			// actual label
			label: 1,

			// default viewer width/height
			width: 	400,
			height: 350
		}

		var data, coordinates;
	})();

	function setHidden( node ) {

		setClass(node, 'visible', true);
		setClass(node, 'hidden');
	}

	function setVisible( node ) {

		setClass(node, 'hidden', true);
		setClass(node, 'visible');
	}

	function setClass( node, className, unset ) {
		while(node.className.indexOf(className) > -1) node.className = node.className.replace(className, '');
		if(!unset) node.className += ' ' + className;
	}

	/**
	 * debug function
	 */
	function _d() {
		for(var a in arguments)
			console.log(arguments[a]);
	}
})()
