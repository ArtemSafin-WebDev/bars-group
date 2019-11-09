var $ = require('jquery');
require('owl.carousel');

module.exports = {

	_initComponentsSlider: function () {
		var self = this;

		var $blocks = $('.jsTComponentsSlider');
		if ($blocks.length == 0) return;

		$blocks.owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			rewind: false,
			loop: false,
			navText: [''],
			navContainer: '.tComponents__nav'
		});
	},

	_initNewsSlider: function () {
		var self = this;

		var $blocks = $('.jsTNewsSlider');
		if ($blocks.length == 0) return;

		$blocks.owlCarousel({
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			margin: 30,
			responsive: {
				0: {
					items: 1.5
				},
				800: {
					items: 2.5
				},
				1366: {
					items: 3.5
				}
			}
		});
	},

	init: function () {
		if (document.body.classList.contains('is-admin')) return;

		var self = this;

		self._initComponentsSlider();
		self._initNewsSlider();
	}
};