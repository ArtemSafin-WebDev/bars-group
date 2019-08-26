var $ = require('jquery');
var NavBanner = require('./navBanner');
var Utils = require('./utils');

module.exports = {

	_elems: {
		$_: $()
	},

	_state: {
		timers: []
	},

	_setActiveVideo: function (index) {
		var self = this;

		var $items = $('#tech-promo .bg-layer__item');
		$items.filter('._active').removeClass('_active').end().find('video')[0].pause();
		$items.eq(index).addClass('_active').end().find('video')[0].play();
	},

	_handleCircleEnter: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var index = $(this).data('index');
		var circleId = $(this).data('circle-id');

		self._state.timers[circleId] = setTimeout(function () {
			self._setActiveVideo(index);
		}, 200);
	},

	_handleCircleLeave: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var circleId = $(this).data('circle-id');

		clearTimeout(self._state.timers[circleId]);
		self._setActiveVideo(0);
	},

	_handleCircleClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $target = $( $(this).attr('href') );
		var tabIndex = $target.parent().index();
		NavBanner.showTabByIndex(tabIndex);

		var SPACE_BEFORE = 200;
		var scrollPos = $target.offset().top - SPACE_BEFORE;
		Utils.scrollTo(scrollPos);
	},

	_bindUI: function () {
		var self = this;

		$('#tech-promo .tech-promo__circle').on('mouseenter', {self: self}, self._handleCircleEnter);
		$('#tech-promo .tech-promo__circle').on('mouseleave', {self: self}, self._handleCircleLeave);
		self._elems.$_.on('click', '.tech-promo__circle', {self: self}, self._handleCircleClick);
	},

	init: function () {
		var self = this;

		var $_ = $('#tech-promo');

		if ( $_.length == 0) return;

		self._elems.$_ = $_;

		$_.find('.tech-promo__orbit').addClass('_active');

		setTimeout(function () {
			$_.find('.tech-promo__point').addClass('_active');
		}, 2000);

		setTimeout(function () {
			$_.find('.tech-promo__center').addClass('_active');
		}, 3000);

		setTimeout(function () {
			$_.find('.tech-promo__circle').addClass('_active');
		}, 3500);

		self._bindUI();
	}
}


