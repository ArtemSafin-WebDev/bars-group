
var NavBanner = {

	_handleItemClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $root = $(this).closest('.nav-banner');

		// set line position
		var $line = $root.find('.nav-banner__line');
		var elemOffset = $(this).position().left;
		$line.css({left: elemOffset});

		// set active class
		$(this)
			.siblings().removeClass('_active')
			.end().addClass('_active');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.nav-banner__item', {self: self}, self._handleItemClick);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};