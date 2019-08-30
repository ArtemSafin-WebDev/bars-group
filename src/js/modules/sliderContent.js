var $ = require('jquery');
require('owl.carousel');

module.exports = {

	_elems: {
		$_: $(),
		$wrapper: $(),
		$slider: $()
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._elems.$slider.trigger('refresh.owl.carousel');
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize', {self: self}, self._handleWindowResize);
	},	

	init: function () {
		var self = this;

		var $_ = $('#slider-content');

		if ( $_.length == 0 ) return;
		if ( $('body').hasClass('is-admin') ) return;

		self._elems.$_ = $_;
		self._elems.$wrapper = $_.find('.slider-content__wrapper');
		self._elems.$slider = $_.find('.owl-carousel');

		self._elems.$slider.owlCarousel({
		    items: 1,
		    dots: false,
		    nav: true,
		    navContainer: '.slider-content__nav'
		});
		
		self._bindUI();
	}

};