

var Overview = {

	_elems: {
		$_: $(),
		$bgItems: $(),
		$aboutItems: $(),
		$navItems: $(),
		$navBodies: $()
	},

	_state: {
		isUserActivityHandled: false,
		currIndex: 0
	},

	_startVideoLoading: function () {
		var self = this;

		self._elems.$_.find('video').each(function () {
			$(this)[0].load();
		});
	},

	_handleUserActivity: function (e) {
		var self = e.data.self;

		if ( self._state.isUserActivityHandled ) return;
		if ( !Modernizr.video || Modernizr.lowbandwidth ) return;

		self._state.isUserActivityHandled = true;
		setTimeout(self._startVideoLoading.bind(self), 100);
	},

	_handleCanPlayEvent: function (e) {
		var self = e.data.self;

		objectFitPolyfill(this);
		$(this).addClass('--active');
		$(this)[0].play();
	},

	_handleLinkClick: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		var nextIndex = $(this).closest('.overview__nav__item').index();
		var currIndex = self._state.currIndex;

		if (nextIndex == currIndex) return;

		// set active nav item
		self._elems.$navItems.eq(currIndex).removeClass('--active');
		self._elems.$navItems.eq(nextIndex).addClass('--active');

		// set active about item
		self._elems.$aboutItems.eq(currIndex).removeClass('--active');
		self._elems.$aboutItems.eq(nextIndex).addClass('--active');

		// collapse bodies
		self._elems.$navBodies.eq(currIndex).collapse('hide');
		self._elems.$navBodies.eq(nextIndex).collapse('show');

		// set active bg item
		if (nextIndex > currIndex) {
			// slide down
			var nextStartPos = -80;
			var currEndPos = 0;
		} else {
			// slide up
			var nextStartPos = 0;
			var currEndPos = -80;
		}

		self._elems.$bgItems.eq(nextIndex)
			.addClass('overview__bg__item--frozen')
			.css({
				transform: 'translateY(' + nextStartPos + 'px)',
				opacity: 0
			});

		setTimeout(function () {

			self._elems.$bgItems.eq(currIndex)
				.css({
					transform: 'translateY(' + currEndPos + 'px)',
					opacity: 0
				});

			self._elems.$bgItems.eq(nextIndex)
				.removeClass('overview__bg__item--frozen')
				.css({
					transform: 'translateY(-40px)',
					opacity: 1
				});

		}, 20);

		self._state.currIndex = nextIndex;
	},

	_bindUI: function () {
		var self = this;

		$('.overview__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		self._elems.$_.on('click', '.overview__nav__link', {self: self}, self._handleLinkClick);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
	},

	init: function () {
		var self = this;

		var $_ = $('#overview');

		if ( !$_.length ) return;

		self._elems.$_ = $_;
		self._elems.$bgItems = self._elems.$_.find('.overview__bg__item');
		self._elems.$aboutItems = self._elems.$_.find('.overview__about__item');
		self._elems.$navItems = self._elems.$_.find('.overview__nav__item');
		self._elems.$navBodies = self._elems.$_.find('.overview__nav__body');

		self._bindUI();

		$('body').trigger('click');
	}

};