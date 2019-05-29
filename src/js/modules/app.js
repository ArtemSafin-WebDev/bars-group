var App = {

	_isFontsReady: function () {
		return $('html').hasClass('wf-active');
	},

	_handleDOMReady: function () {
		var self = this;

		var timer = setInterval(function () {
			if ( self._isFontsReady() ) {
				clearInterval(timer);

				// init modules here
				ImDigits.init();
				ImOverview.init();
			}
		}, 20);
	},

	_bindUI: function () {
		var self = this;

		$(document).ready(self._handleDOMReady.bind(self));
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};