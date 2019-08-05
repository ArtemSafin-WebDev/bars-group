
var NavBanner = {

	_elems: {
		$slider: $()
	},

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

		// show slide
		var index = $(this).index();
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

		// add wrapper
		var $wrapper = $('<div class="owl-carousel"></div>');
		$wrapper.insertBefore($slides.first());

		// reattach slides
		$slides.detach().appendTo($wrapper);

		// init slider
		$wrapper.owlCarousel({
			items: 1,
			mouseDrag: false,
			touchDrag: false,
			dots: false
		});


		self._elems.$slider = $wrapper;
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.nav-banner__item', {self: self}, self._handleItemClick);
	},

	init: function () {
		var self = this;

		self._wrapBlocksAsSlides();
		self._bindUI();
	}
};