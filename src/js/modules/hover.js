var $ = require('jquery');

module.exports = {

	_handleWingsMouseenter: function (e) {
		

		$(this).addClass('_hover');
	},

	_handleWingsMouseleave: function (e) {
		

		$(this).removeClass('_hover');
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