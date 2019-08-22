var $ = require('jquery');
require('owl.carousel');

module.exports = {

	_initTasksSlider: function () {
		var self = this;

		var $blocks = $('.jsTTasksSlider');
		if ($blocks.length == 0) return;

		$blocks.owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			navContainer: '.tTasks__nav'
		});
	},

	_initIntroducedSlider: function () {
		var self = this;

		var $blocks = $('.jsTIntroducedSlider');
		if ($blocks.length == 0) return;

		$blocks.owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			navContainer: '.tIntroduced__nav'
		});
	},

	_initComponentsSlider: function () {
		var self = this;

		var $blocks = $('.jsTComponentsSlider');
		if ($blocks.length == 0) return;

		$blocks.owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
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

	_handleWindowResize: function (e) {
		var self = e.data.self;

		if (window.matchMedia("(min-width: 601px)").matches) {
			$('.jsTTasksSlider, .jsTIntroducedSlider').addClass('owl-carousel');

			self._initTasksSlider();
			self._initIntroducedSlider();

		} else {
			$('.jsTTasksSlider, .jsTIntroducedSlider')
				.owlCarousel('destroy').removeClass('owl-carousel');
		}
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		self._initTasksSlider();
		self._initIntroducedSlider();
		self._initComponentsSlider();
		self._initNewsSlider();

		self._bindUI();

	}
};