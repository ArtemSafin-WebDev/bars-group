
var TechPromo = {

	_state: {
		timers: []
	},

	_setActiveVideo: function (index) {
		var self = this;

		var $items = $('#tech-promo .tech-promo__figure__item');
		$items.filter('.--active').removeClass('--active').end().find('video')[0].pause();
		$items.eq(index).addClass('--active').end().find('video')[0].play();
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

	_bindUI: function () {
		var self = this;

		$('#tech-promo .tech-promo__circle').on('mouseenter', {self: self}, self._handleCircleEnter);
		$('#tech-promo .tech-promo__circle').on('mouseleave', {self: self}, self._handleCircleLeave);
	},

	init: function () {
		var self = this;

		var $_ = $('#tech-promo');

		if ( $_.length == 0) return;

		$_.find('.tech-promo__orbit').addClass('--active');

		setTimeout(function () {
			$_.find('.tech-promo__point').addClass('--active');
		}, 2000);

		setTimeout(function () {
			$_.find('.tech-promo__center').addClass('--active');
		}, 3000);

		setTimeout(function () {
			$_.find('.tech-promo__circle').addClass('--active');
		}, 3500);

		self._bindUI();
	}
}


