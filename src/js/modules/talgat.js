
(function () {

	function manipulation() {
		var
			windowWidth = $(window).innerWidth(),
			containerWidth = $('.page__center').width(),
			containerPadding = $('.page__inner').innerWidth() - $('.page__inner').width(),
			offset = (windowWidth - containerWidth) / 2 + containerPadding / 2;

		$('.jsOffsetRight').css('margin-right', -offset + 'px');
	}

	$(window).on('load', function() {
		setTimeout(function() {
			manipulation();
		}, 700);
	});

	$(window).on('load, resize', function() {
		manipulation();
	});

	$(document).ready(function() {
		if ($('.jsTTasksSlider').length) {
			$('.jsTTasksSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tTasks__nav'
			});
		}

		if ($('.jsTIntroducedSlider').length) {
			$('.jsTIntroducedSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tIntroduced__nav'
			});
		}

		if ($('.jsTComponentsSlider').length) {
			$('.jsTComponentsSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tComponents__nav'
			});
		}

	});

})();
