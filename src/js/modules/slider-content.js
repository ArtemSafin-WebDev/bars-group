
var SliderContent = {

	_elems: {
		$_: $(),
		$wrapper: $(),
		$slider: $()
	},

	_setSliderWidth: function () {
		var self = this;

		var MIN_WINDOW_WIDTH = 1300;
		var MAX_WING_WIDTH = 200;

		var windowWidth = $(window).width();
		var sectionWidth = self._elems.$_.width()
		var sectionEnd = self._elems.$_.offset().left + sectionWidth;
		var wingWidth = windowWidth - sectionEnd;

		if (wingWidth > MAX_WING_WIDTH || windowWidth < MIN_WINDOW_WIDTH) {
			self._elems.$wrapper.css({ 'margin-right': 0 });
			self._elems.$_.removeClass('slider-content--has-wing');
		} else {
			self._elems.$wrapper.css({ 'margin-right': -wingWidth });
			self._elems.$_.addClass('slider-content--has-wing');
		}
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setSliderWidth();
		self._elems.$slider.trigger('refresh.owl.carousel');
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._elems.$slider.trigger('prev.owl.carousel')
	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._elems.$slider.trigger('next.owl.carousel')
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('click', '.js-slider-content-prev', {self: self}, self._handlePrevButton);
		self._elems.$_.on('click', '.js-slider-content-next', {self: self}, self._handleNextButton);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},	

	init: function () {
		var self = this;

		var $_ = $('#slider-content');

		if ( !$_.length ) return;
		if ( $('body').hasClass('is-admin') ) return;

		self._elems.$_ = $_;
		self._elems.$wrapper = $_.find('.slider-content__wrapper');
		self._elems.$slider = $_.find('.owl-carousel');

		self._setSliderWidth();

		self._elems.$slider.owlCarousel({
		    items: 1,
		    dots: false
		});
		
		self._bindUI();
	}

};