var App = {

	_handleDOMReady: function () {
		var self = this;
		
		WebFont.load({
			google: {
				families: ['Open Sans:400,600,700:cyrillic']
			},
			active: function () {
				
				// init modules here
				ImDigits.init();
			}
		});

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