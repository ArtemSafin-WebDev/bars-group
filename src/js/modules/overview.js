var $ = require('jquery');
require('./../../../bower_components/bootstrap/js/dist/util');
require('./../../../bower_components/bootstrap/js/dist/collapse');

module.exports = {

	_elems: {
		$_: $(),
		$bgItems: $(),
		$aboutItems: $(),
		$navItems: $(),
		$navBodies: $()
	},

	_state: {
		currIndex: 0
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

		self._elems.$_.on('click', '.overview__nav__link', {self: self}, self._handleLinkClick);
	},

	init: function () {
		var self = this;

		var $_ = $('#overview');

		if ( $_.length == 0 ) return;

		self._elems.$_ = $_;
		self._elems.$bgItems = self._elems.$_.find('.overview__bg__item');
		self._elems.$aboutItems = self._elems.$_.find('.overview__about__item');
		self._elems.$navItems = self._elems.$_.find('.overview__nav__item');
		self._elems.$navBodies = self._elems.$_.find('.overview__nav__body');

		self._bindUI();
	}

};