var $ = require('jquery');
const bodyScrollLock = require('body-scroll-lock');

module.exports = {

	_elems: {
		$_: $(),
		$scroll: $()
	},

	_state: {
		isOpened: false
	},

	_open: function () {
		var self = this;

		if (self._state.isOpened) return;

		$('body').addClass('page__locked');
		self._elems.$_.addClass('_active');
		bodyScrollLock.disableBodyScroll(self._elems.$scroll[0]);

		self._state.isOpened = true;
	},

	_close: function () {
		var self = this;

		if (!self._state.isOpened) return;

		$('body').removeClass('page__locked');
		self._elems.$_.removeClass('_active');
		bodyScrollLock.enableBodyScroll(self._elems.$scroll[0]);

		self._state.isOpened = false;
	},

	_handleOpenButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._open();
	},

	_handleCloseButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._close();
	},

	_handleMatchMedia: function (mql) {
		var self = this;

		if (!mql.matches) self._close();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.js-nav-mobile-open', {self: self}, self._handleOpenButton);
		$(document).on('click', '.js-nav-mobile-close', {self: self}, self._handleCloseButton);
		window.matchMedia('(max-width: 950px)').addListener(self._handleMatchMedia.bind(self));
	},

	init: function () {
		var self = this;

		var $_ = $('#nav-mobile');

		if ($_.length == 0) return;

		self._elems.$_ = $_;
		self._elems.$scroll = $_.find('.nav-mobile__side__inner');

		self._bindUI();
	}
}