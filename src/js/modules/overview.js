

var Overview = {

	_state: {
		isUserActivityHandled: false,
		currIndex: null
	},

	_startVideoLoading: function () {
		var self = this;

		$('#overview video').each(function () {
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
		$(this).addClass('_active');
		$(this)[0].play()
	},

	_handleLinkClick: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		var nextIndex = $(this).closest('.overview__nav__item').index();
		var currIndex = self._state.currIndex;

		if (nextIndex == currIndex) return;

		var $_ = $('#overview');

		// set active nav item
		var $navItems = $_.find('.overview__nav__item');
		$navItems.eq(currIndex).removeClass('_active');
		$navItems.eq(nextIndex).addClass('_active');

		// set active about item
		var $aboutItems = $_.find('.overview__about__item');
		$aboutItems.eq(currIndex).removeClass('_active');
		$aboutItems.eq(nextIndex).addClass('_active');

		// collapse bodies
		var $navBodies = $_.find('.overview__nav__body');
		$navBodies.eq(currIndex).collapse('hide');
		$navBodies.eq(nextIndex).collapse('show');

		// set active bg item
		var $bgItems = $_.find('.overview__bg__item');
		if (nextIndex > currIndex) {
			// slide down
			var nextStartPos = -80;
			var currEndPos = 0;
		} else {
			// slide up
			var nextStartPos = 0;
			var currEndPos = -80;
		}

		$bgItems.eq(nextIndex).removeClass('_animate').css({
			transform: 'translateY(' + nextStartPos + 'px)',
			opacity: 0
		});

		setTimeout(function () {

			$bgItems.eq(currIndex).css({
				transform: 'translateY(' + currEndPos + 'px)',
				opacity: 0
			});

			$bgItems.eq(nextIndex).addClass('_animate').css({
				transform: 'translateY(-40px)',
				opacity: 1
			});

		}, 20);

		

		self._state.currIndex = nextIndex;
		
	},

	_bindUI: function () {
		var self = this;

		$('.overview__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(document).on('click', '.overview__nav__link', {self: self}, self._handleLinkClick);
	},

	init: function () {
		var self = this;

		if ( $('#overview').length == 0 ) return;

		self._bindUI();

		$('body').trigger('click');
	}

};