
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
		init = function( m, l, i ) {
			intro = i, labels = l, map = m;
		}

		// set prototype of _Survey object
		init.prototype = _Survey.prototype = {
			// make sure that survey's constructor is survey itself
			constructor: _Survey,

			// we are ready to start
			start: function(pos) {
				if(typeof pos !== 'object' || !pos.length) {
					throw new ReferenceError();
				} positions = pos;

				setHidden(intro);
				setVisible(map);

				var lbldst = document.getElementById('label');
				lbldst.style.width = this.width;
				lbldst.style.height = this.height;

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
				}, 2800);
			},

			stop: function() {
				var map = document.getElementById('place-view');
				setClass(map, 'point-view', true); // reset to default state
				this.moveMap(0, 0);
				map.style.width = '100%';
				map.style.height = '100%';

				setHidden(document.getElementById('label'));
			},

			next: function() {
				if(positions.length === this.label) {
					this.stop();
					return; // skip if there are no more coordinates
				}

				var map = document.getElementById('place-view');

				setClass(map, 'point-view', true);

				this.moveMap(0, 0);

				map.style.width = '100%';
				map.style.height = '100%';
				
				var instance = this;
				window.setTimeout(function() {
					instance.view(++instance.label);
				}, 2000);
			},

			view: function( labelNo ) {
				var pos = positions[ (labelNo) - 1 ]; // 0 => x, 1 => y
				this.moveMap.apply(this, pos);

				var aLabel = document.getElementById('place-view');
				setClass(aLabel, 'point-view'); // apply transition

				aLabel.style.width = this.width;
				aLabel.style.height = this.height;

				/* show some labels about it */
				var label;
				label = labels.getElementsByTagName('dl')[0];
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

				_d(label[0], label[1])

				// prepare label
				var lbldest = document.getElementById('label');
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
				_d(x, y, map)
			},

			// actual label
			label: 1,

			// default viewer width/height
			width: 400,
			height: 350
		}

		// the positions object used  to determine how zoom and move the map
		var positions;
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

		var cls = node.className.replace(new RegExp(className), '');

		node.className =
			(unset
				? cls
				: cls + (' ' + className)
			).trim();
		;
	}

	/**
	 * debug function
	 */
	function _d() {
		for(var a in arguments)
			console.log(arguments[a]);
	}
})()
