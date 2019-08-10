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

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._elems.$slider.trigger('prev.owl.carousel')
	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._elems.$slider.trigger('next.owl.carousel')
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('click', '.js-slider-content-prev', {self: self}, self._handlePrevButton);
		self._elems.$_.on('click', '.js-slider-content-next', {self: self}, self._handleNextButton);
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
		    dots: false
		});
		
		self._bindUI();
	}

};