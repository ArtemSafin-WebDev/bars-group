
var Talgat = {

	init: function () {

		$('.jsTTasksSlider').owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			navContainer: '.tTasks__nav'
		});

		$('.jsTIntroducedSlider').owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			navContainer: '.tIntroduced__nav'
		});

		$('.jsTComponentsSlider').owlCarousel({
			items: 1,
			dots: false,
			nav: true,
			loop: true,
			navText: [''],
			navContainer: '.tComponents__nav'
		});

	}
};