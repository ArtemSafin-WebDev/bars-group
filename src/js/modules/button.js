var Button = {

	_handleButtonMouseover: function (e) {
		var self = e.data.self;

		$(this).addClass('--active');
	},

	_handleButtonMouseout: function (e) {
		var self = e.data.self;

		$(this).removeClass('--active');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('mouseover', '.button', {self: self}, self._handleButtonMouseover);
		$(document).on('mouseout', '.button', {self: self}, self._handleButtonMouseout);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};