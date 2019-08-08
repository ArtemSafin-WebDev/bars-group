
var Hover = {

	_handleWingsMouseenter: function (e) {
		var self = e.data.self;

		$(this).addClass('--hover');
	},

	_handleWingsMouseleave: function (e) {
		var self = e.data.self;

		$(this).removeClass('--hover');
	},


	_bindUI: function () {
		var self = this;

		$(document).on('mouseenter', '.js-hover-wings', {self: self}, self._handleWingsMouseenter);
		$(document).on('mouseleave', '.js-hover-wings', {self: self}, self._handleWingsMouseleave);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
}