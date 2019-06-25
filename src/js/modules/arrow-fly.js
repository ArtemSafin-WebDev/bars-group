var ArrowFly = {

	_handleAreaMouseover: function (e) {
		var self = e.data.self;

		$(this).addClass('--active');
	},

	_handleAreaMouseout: function (e) {
		var self = e.data.self;

		$(this).removeClass('--active');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('mouseover', '.js-arrow-fly-area', {self: self}, self._handleAreaMouseover);
		$(document).on('mouseout', '.js-arrow-fly-area', {self: self}, self._handleAreaMouseout);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};