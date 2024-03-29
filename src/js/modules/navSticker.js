var $ = require('jquery');
require('jQuery-One-Page-Nav');
require('midnight.js');

module.exports = {

	_elems: {
		$_: $(),
		$static: $(),
		$fixed: $(),
		$lists: $(),
		$items: $()
	},

	_initOnePageNav: function () {
		var self = this;

		self._elems.$static.find('.nav-sticker__list').onePageNav({
			currentClass: '_active',
			scrollChange: function ($current) {
				var index = $current.index();
				self._setItemsActiveState(index);
			}
		});
	},

	_initMidnight: function () {
		var self = this;

		self._elems.$fixed.midnight();
	},

	_isItemInsideOfFixed: function ($item) {
	

		return !!$item.closest('.midnightInner').length;
	},

	_setItemsActiveState: function (index) {
		var self = this;

		self._elems.$items.each(function () {
			$(this).toggleClass('_active', $(this).index() === index);
		});
	},

	_setNavsHiddenState: function () {
		var self = this;

		var scrollTop = $(window).scrollTop();
		var staticOffsetTop = self._elems.$static.offset().top;
		var isStaticHidden = staticOffsetTop - scrollTop < 40;
		var isFixedHidden = !isStaticHidden;

		self._elems.$static.toggleClass('_hidden', isStaticHidden);
		self._elems.$fixed.toggleClass('_hidden', isFixedHidden);
	},

	_handleWindowScroll: function () {
		var self = this;

		self._setNavsHiddenState();
	},

	_handleLinkClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var index = $(this).parent().index();

		if ( self._isItemInsideOfFixed($(this)) ) {
			self._elems.$static
				.find('.nav-sticker__item').eq(index)
				.find('.nav-sticker__link').trigger('click');
		} else {
			self._setItemsActiveState(index);
		}
	},

	_handleListMouseEnter: function (e) {
		var self = e.data.self;

		self._elems.$_.addClass('_hover');
	},

	_handleListMouseLeave: function (e) {
		var self = e.data.self;

		self._elems.$_.removeClass('_hover');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('mouseenter', '.nav-sticker__list', {self: self}, self._handleListMouseEnter);
		$(document).on('mouseleave', '.nav-sticker__list', {self: self}, self._handleListMouseLeave);
		$(document).on('click', '.nav-sticker__link', {self: self}, self._handleLinkClick);
		window.addEventListener('scroll', self._handleWindowScroll.bind(self), false);
	},

	init: function () {
		if (document.body.classList.contains('is-admin')) return;
		var self = this;

		var $_ = $('#nav-sticker');

		if ( $_.length == 0) return;

		self._elems.$_ = $_;
		self._elems.$static = $('#nav-sticker-static');
		self._elems.$fixed = $('#nav-sticker-fixed');

		// creates nav clones
		self._initMidnight();

		// save links after cloning & init for each nav
		self._elems.$lists = $_.find('.nav-sticker__list');
		self._elems.$items = $_.find('.nav-sticker__item');
		self._initOnePageNav();

		// show or hide
		self._setNavsHiddenState();

		self._bindUI();
	}

};