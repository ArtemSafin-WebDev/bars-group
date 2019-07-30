
var TechPromo = {

	_handleCanPlayEvent: function (e) {
		var self = e.data.self;

		console.log(1);

		objectFitPolyfill(this);
		$(this).addClass('--active');

		if ( $(this).closest('.tech-promo__figure__item').index() == 0 ) {
			$(this)[0].play();
		}
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
		self._setActiveVideo(index);
	},

	_handleCircleLeave: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._setActiveVideo(0);
	},

	_bindUI: function () {
		var self = this;

		$('#tech-promo video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
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
		}, 3700);

		setTimeout(function () {
			$_.find('.tech-promo__circle').addClass('--active');
		}, 4500);

		self._bindUI();
	}
}


