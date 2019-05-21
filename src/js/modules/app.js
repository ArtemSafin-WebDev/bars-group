var App = {

	_handleDOMReady: function () {
		var self = this;

		// init modules here
		// ModuleName.init();

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