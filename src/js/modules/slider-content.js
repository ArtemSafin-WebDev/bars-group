
var SliderContent = {

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
	}

};