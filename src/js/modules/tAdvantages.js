var $ = require('jquery');

module.exports = {

	_setActiveTab: function ($block, nextIndex) {
		

		var $ctrlItems = $block.find('.tAdvantages__nav').children();

		var maxIndex = $ctrlItems.length - 1;
		if (nextIndex > maxIndex) nextIndex = maxIndex;
		if (nextIndex < 0) nextIndex = 0;

		// set active tab
		$ctrlItems.removeClass('active').eq(nextIndex).addClass('active');

		// set active body
		var $bodyItems = $block.find('.tAdvantages__slider').children();
		$bodyItems.removeClass('active').eq(nextIndex).addClass('active');

		// update state
		var state = $block.data('state');
		state.currIndex = nextIndex;
	},

	_handleTabButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $block = $(this).closest('.tAdvantages');

		var currIndex = $(this).index();
		self._setActiveTab($block, currIndex);
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $block = $(this).closest('.tAdvantages');
		var currIndex = $block.data('state').currIndex;
		self._setActiveTab($block, ++currIndex);
	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $block = $(this).closest('.tAdvantages');
		var currIndex = $block.data('state').currIndex;
		self._setActiveTab($block, --currIndex);
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.jsTAdvNavItem', {self: self}, self._handleTabButton);
		$(document).on('click', '.jsNavRight', {self: self}, self._handleNextButton);
		$(document).on('click', '.jsNavLeft', {self: self}, self._handlePrevButton);
	},

	init: function () {
		var self = this;

		var $blocks = $('.tAdvantages');
		if ($blocks.length == 0) return;
		
		$blocks.data('state', {currIndex: 0})

		self._bindUI();
	}
};