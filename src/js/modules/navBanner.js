var $ = require('jquery');
require('owl.carousel');

module.exports = {

	_elems: {
		$_: $(),
		$slider: $()
	},

	_setLineDimensions: function ($item) {
		var self = this;

		var $item = $item || self._elems.$_.find('.nav-banner__item._active');
		var $line = self._elems.$_.find('.nav-banner__line');

		if ($item.length == 0) return;

		$line.css({
			left: $item.position().left + parseInt($item.css('padding-left')), 
			width: $item.width()
		});
	},

	_handleLinkClick: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		var $item = $(this).closest('.nav-banner__item');

		self._setLineDimensions($item);

		// set active class
		$item
			.siblings().removeClass('_active')
			.end().addClass('_active');

		// show slide
		var index = $item.index();
		self._elems.$slider.trigger('to.owl.carousel', [index]);
	},

	_wrapBlocksAsSlides: function () {
		var self = this;

		// find all blocks
		var $blocks = $('.block-wrapper');

		// filter slides
		var $slides = $blocks.filter(function (index, elem) {
			return !!$(elem).children('[data-tabs]').length;
		}); 

		if ($slides.length == 0) return;

		// add wrapper
		var $wrapper = $('<div class="owl-carousel nav-banner__tabs"></div>');
		$wrapper.insertBefore($slides.first());

		// reattach slides
		$slides.detach().appendTo($wrapper);

		// init slider
		$wrapper.owlCarousel({
			items: 1,
			mouseDrag: false,
			touchDrag: false,
			dots: false,
			autoHeight: true
		});

		self._elems.$slider = $wrapper;
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setLineDimensions();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.nav-banner__link', {self: self}, self._handleLinkClick);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	showTabByIndex: function (index) {
		var self = this;

		self._elems.$_.find('.nav-banner__item')
			.eq(index).find('.nav-banner__link').trigger('click');
	},

	init: function () {
		var self = this;

		var $_ = $("#nav-banner");

		if ( $_.length == 0) return;
		if ( $('body').hasClass('is-admin') ) return;

		self._elems.$_ = $_;

		self._setLineDimensions();
		self._wrapBlocksAsSlides();
		self._bindUI();
	}
};