
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
				}

				setHidden(intro);
				setVisible(map);
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
})()
