var $ = require('jquery');
require('owl.carousel');

var Utils = require('./utils');

module.exports = {

	_state: {
		isInited: false
	},

	_elems: {
		$blocks: $()
	},

	_wrapTasksByGroups: function () {
		var self = this;

		self._elems.$blocks.each(function () {
			var $block = $(this);
			var $slider = $block.find('.js-tasks-slider');

			var itemClass = $block.data('item');
			var wrapperClass = $block.data('wrapper');
			var items = $block.find('.' + itemClass).detach().toArray();

			$block.find('.' + wrapperClass).remove();

			do {
				var $wrapper = $('<div class="' + wrapperClass + '"></div>');
				var portion = items.splice(0, 6);

				portion.forEach(item => {
					$(item).appendTo($wrapper);
				});

				$wrapper.appendTo($slider);

			} while ( items.length );

		});
	},

	_initTasksSliders: function () {
		var self = this;

		if (self._state.isInited) return;

		self._elems.$blocks.each(function () {
			$(this).find('.js-tasks-slider')
				.addClass('owl-carousel')
				.owlCarousel({
					items: 1,
					loop: true,
					nav: true,
					navContainer: $(this).find('.js-tasks-nav'),
					navText: [''],
					dots: false
				});
		});

		self._state.isInited = true;
	},

	_destroySliders: function () {
		var self = this;

		if (!self._state.isInited) return;

		self._elems.$blocks.each(function () {
			$(this).find('.js-tasks-slider')
				.removeClass('owl-carousel')
				.owlCarousel('destroy');
		});

		self._state.isInited = false;
	},

	_handleWindowResize: function (e) {
		var self = e && e.data.self || this;

		if (window.matchMedia("(min-width: 601px)").matches) {
			self._initTasksSliders();
		} else {
			self._destroySliders();
		}
	},

	_handleShowMoreClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $block = $(this).closest('.js-tasks');
		var $button = $(this);

		$block.add($button).toggleClass('_opened');

		if ( $button.hasClass('_opened') == false ) {
			Utils.scrollTo($block.offset().top);
		}
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.js-tasks-toggle', {self: self}, self._handleShowMoreClick);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		var $blocks = $('.js-tasks');

		if ( $('body').hasClass('is-admin') ) return; 
		if ( $blocks.length == 0 ) return;

		self._elems.$blocks = $blocks;

		self._wrapTasksByGroups();
		self._handleWindowResize();
		self._bindUI();

	}
};