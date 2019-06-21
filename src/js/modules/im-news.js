
var ImNews = {

	_state: {
		sly: null,
		maxIndex: null,
		currIndex: 0
	},

	_setSliderWidth: function () {
		var self = this;

		var $wrapper = $('#im-wrapper');
		var $slider  = $('#im-news .im-news__slider');
		var wrapperOffset = $wrapper.offset().left;
		var wrapperWidth = $wrapper.width();
		var sliderOffset = $slider.offset().left;
		var sliderWidth = wrapperWidth- (sliderOffset - wrapperOffset);
		$slider.width(sliderWidth);
	},

	_initSlider: function () {
		var self = this;

		var $_ = $('#im-news');
		var $slider  = $_.find('.im-news__slider');
		var $prevBtn = $_.find('.digits__prev');
		var $nextBtn = $_.find('.digits__next');

		self._state.maxIndex = $_.find('.im-news__item').length - 1;
		self._state.sly = new Sly($slider[0], {
			horizontal: 1,
			itemNav: 'basic',
			speed: 300,
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: true
		}).init();

	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var currIndex = self._state.currIndex;
		var nextIndex = currIndex + 1;
		if (nextIndex > self._state.maxIndex) return;

		self._state.sly.toStart(++self._state.currIndex);
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var currIndex = self._state.currIndex;
		var nextIndex = currIndex - 1;
		if (nextIndex < 0) return;

		self._state.sly.toStart(--self._state.currIndex);
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setSliderWidth();
		self._state.sly.reload();
	},

	_handleMoveEnd: function () {
		var self = this;

	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
		$(document).on('click', '#im-news .digits__next', {self: self}, self._handleNextButton);
		$(document).on('click', '#im-news .digits__prev', {self: self}, self._handlePrevButton);
		self._state.sly.on('moveEnd', self._handleMoveEnd.bind(self));
	},

	init: function () {
		var self = this;

		if ( $('#im-news').length == 0 ) return;

		self._setSliderWidth();
		self._initSlider();
		self._bindUI();
	}
};