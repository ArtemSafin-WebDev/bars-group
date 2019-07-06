
var News = {

	_state: {
		owl: null
	},

	_setSliderWidth: function () {
		var self = this;

		var $wrapper = $('#wrapper');
		var $slider  = $('#news .news__slider');
		var wrapperOffset = $wrapper.offset().left;
		var wrapperWidth = $wrapper.width();
		var sliderOffset = $slider.offset().left;
		var sliderWidth = wrapperWidth- (sliderOffset - wrapperOffset);
		$slider.width(sliderWidth);
	},

	_initSlider: function () {
		var self = this;

		self._state.owl = $('#news .news__list').owlCarousel({
		    loop: true,
		    autoWidth: true,
		    touchDrag: false,
		    mouseDrag: false,
		    smartSpeed: 500
		});	

	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._state.owl.trigger('next.owl.carousel');

		$('#news .news__item.--active')
			.removeClass('--active')
			.parent().next().find('.news__item')
			.addClass('--active');
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		self._state.owl.trigger('prev.owl.carousel');

		$('#news .news__item.--active')
			.removeClass('--active')
			.parent().prev().find('.news__item')
			.addClass('--active');

	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setSliderWidth();
		self._state.owl.trigger('refresh.owl.carousel');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '#news .js-news-next', {self: self}, self._handleNextButton);
		$(document).on('click', '#news .js-news-prev', {self: self}, self._handlePrevButton);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#news').length == 0 ) return;

		self._setSliderWidth();
		self._initSlider();
		self._bindUI();
	}
};