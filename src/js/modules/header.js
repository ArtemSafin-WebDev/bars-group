
var Header = {


	_adjustMoreItem: function () {
		var self = this;

		var $_ = $('#header');

		// close dropdown during resizing
		var $more = $_.find('.header__menu__item--more');
		$more.removeClass('--opened');

		// compare container & items top offsets and find break point
		var $crop  = $_.find('.header__menu__crop');
		var cropOffset = $crop.offset().top;
		var $items = $crop.find('.header__menu__item');
		var lastIndex = 0;

		$items.each(function (index) {
			var itemOffset = $(this).offset().top;
			if (itemOffset == cropOffset) {
				lastIndex = index;
			}
		});

		// show 'more', if lastIndex less than maxIndex
		var $lastItem = $items.eq(lastIndex);
		var maxIndex = $items.length - 1;

		if (lastIndex < maxIndex) {

			// show 'more' and position it
			var lastItemLeft = $lastItem.offset().left - $crop.offset().left;
			var lastItemMargin = parseInt($lastItem.css('margin-right'));
			var lastItemWidth = $lastItem.width();

			var moreOffset = lastItemLeft + lastItemMargin + lastItemWidth;
			$more.addClass('--shown').css({ left: moreOffset + 'px'});

			// show/hide 'more' elements
			var $moreItems = $_.find('.header__menu__down__body > div');
			$moreItems.each(function (index) {
				if (index > lastIndex) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});

		} else {
			$more.removeClass('--shown');
		}

	},

	_handleMoreClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		$('#header .header__menu__item--more').toggleClass('--opened');
	},

	_handleDocumentClick: function (e) {
		var self = e.data.self;

		var moreSelector = '.header__menu__item--more';
		if ( $(e.target).closest(moreSelector).length == 0 ){
			$('#header ' + moreSelector).removeClass('--opened');
		}
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._adjustMoreItem();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', {self: self}, self._handleDocumentClick);
		$(document).on('click', '.header__menu__item--more > a', {self: self}, self._handleMoreClick);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#header').length == 0) return;

		self._adjustMoreItem();
		self._bindUI();
	}
}