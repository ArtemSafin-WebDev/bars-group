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
				Digits.init();
				ImOverview.init();
				ImSlider.init();
				Header.init();
				News.init();

				if (getScrollbarWidth() == 0) {
					$("html").addClass('hidden-scrollbar');
				}
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