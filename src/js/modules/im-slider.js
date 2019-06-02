
var ImSlider = {

	_state: {
		isUserActivityHandled: false,
		maxListWidth: null,
		maxScrollLeft: null,
		lastRangeValue: null
	},

	_calcDimensions: function () {
		var self = this;

		self._state.maxListWidth = self._getMaxListWidth();
		self._state.maxScrollLeft = self._getMaxScrollLeft();
	},

	_getMaxListWidth: function () {
		var self = this;

		var maxWidth = 0;
		$('#im-slider .im-slider__list').each(function () {
			var $lastItem = $(this).find('.im-slider__item').last();
			var listOffset = $(this).offset().left;
			var itemOffset = $lastItem.offset().left;
			var itemWidth = $lastItem.width();
			var listWidth = itemOffset - listOffset + itemWidth;
			maxWidth = Math.max(maxWidth, listWidth);
		});
		return maxWidth;
	},

	_getMaxScrollLeft: function () {
		var $scrollBox = $('#im-slider .im-slider__scroll');
		var currScrollLeft = $scrollBox.scrollLeft();
		$scrollBox.scrollLeft(100000);
		var maxScrollLeft = $scrollBox.scrollLeft();
		$scrollBox.scrollLeft(currScrollLeft);
		return maxScrollLeft;
	},

	_setGridLinesWidth: function () {
		var self = this;

		$('#im-slider .im-slider__line').width(self._state.maxListWidth);
	},

	_initImagerJs: function () {
		new Imager('#im-slider .im-slider__bg__image img', { 
			availableWidths: [600, 1000], 
			availablePixelRatios: [1, 2],
			onImagesReplaced: function () {
				$(this.selector).each(function () {
					var src = $(this).attr('src');
					$(this).parent().css({ 'background-image': 'url(' + src + ')' });
				});
			}
		});
	},

	_initRangeSlider: function () {
		var self = this;

		var $range = $('#im-slider .im-slider__range');
		$range.find('input').rangeslider({
			polyfill: false,
			onInit: function () {
				$range.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
			},
			onSlide: _.throttle(function(position, value) {
				if (value == self._state.lastRangeValue) return;
				self._state.lastRangeValue = value;
				
				var isHandleActive = $range.find('.rangeslider').hasClass('rangeslider--active');
				if (!isHandleActive) return;

				var scrollLeft = self._state.maxScrollLeft / 1000 * value; 
				$('#im-slider .im-slider__scroll').scrollLeft(scrollLeft);
			}, 50)
		});

	},

	_startVideoLoading: function () {
		var self = this;

		$('#im-slider video').each(function () {
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
	},

	_handleMouseOver: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video._active');
		if ($video.length) {
			$video[0].play();
		}
	},

	_handleMouseOut: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video._active');
		if ($video.length) {
			$video[0].pause();
		}
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._calcDimensions();
		self._setGridLinesWidth();
	},

	_handleSliderScroll: function (e) {
		var self = e.data.self;

		var scrollLeft = $('#im-slider .im-slider__scroll').scrollLeft();
		var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
		$('#im-slider .im-slider__range input').val(rangeValue).change();
	},

	_bindUI: function () {
		var self = this;

		$('.im-slider__scroll').on('scroll', {self: self}, _.throttle(self._handleSliderScroll, 50));
		$('.im-slider__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(document).on('mouseover', '.im-slider__item', {self: self}, self._handleMouseOver);
		$(document).on('mouseout', '.im-slider__item', {self: self}, self._handleMouseOut);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#im-slider').length == 0 ) return;

		self._calcDimensions();
		self._setGridLinesWidth();
		self._initRangeSlider();
		self._initImagerJs();
		self._bindUI();

		$('body').trigger('click');
	}

};