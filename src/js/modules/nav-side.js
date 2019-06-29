
var NavSide = {

	_updateWingWidth: function () {
		var self = this;

		var MAX_WIDTH = 200;

		var $_ = $('#nav-side');
		var wingWidth = $_.offset().left;

		if (wingWidth > MAX_WIDTH) {
			$_.removeClass('--has-wing');
		} else {
			$_.addClass('--has-wing');
		}

	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._updateWingWidth();
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#nav-side').length == 0) return;

		self._updateWingWidth();
		self._bindUI();
	}
}