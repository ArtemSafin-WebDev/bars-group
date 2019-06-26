
var SliderContent = {

	_updateSliderWidth: function () {
		var self = this;

		var $_ = $('#slider-content');
		var $slider = $_.find('.slider-content__list');

		var MAX_WING_WIDTH = 200;

		var windowWidth = $(window).width();
		var sectionWidth = $_.width()
		var sectionEnd = $_.offset().left + sectionWidth;
		var wingWidth = windowWidth - sectionEnd;

		if (wingWidth > MAX_WING_WIDTH) {
			$slider.css({ 'margin-right': 0 });
			$_.removeClass('--has-wing');
		} else {
			$slider.css({ 'margin-right': -wingWidth });
			$_.addClass('--has-wing');
		}

		$slider.slick('refresh');
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._updateSliderWidth();
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},	

	init: function () {
		var self = this;

		if ( $('#slider-content').length == 0 ) return;
		if ( $('body').hasClass('is-admin') ) return;

		var $_ = $('#slider-content');

		$_.find('.slider-content__list').slick({
			dots: false,
			infinite: false,
			prevArrow: $_.find('.js-slider-content-prev'),
			nextArrow: $_.find('.js-slider-content-next'),
			fade: true
		});

		self._updateSliderWidth();
		self._bindUI();
	}

};