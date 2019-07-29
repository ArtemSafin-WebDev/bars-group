var App = {
	
	_handleDOMReady: function () {
		var self = this;

		// init modules here
		GanttSlider.init();
		CitiesSlider.init();
		SliderContent.init();
		SliderDigits.init();
		SliderTabs.init();
		AboutSlider.init();
		Header.init();
		News.init();
		Form.init();
		ScrollableTable.init();
		NewsSlider.init();
		NewsPhotoSlider.init();
		NewsToggles.init();
		NavBanner.init();
		TechPromo.init();
		Overview.init();
		NavMobile.init();
	},

	_handleWindowLoad: function () {
		var self = this;

		setTimeout(function () {
			$('#hello').removeClass('hello--active');
			$('body').removeClass('page__locked');
		}, 700);
	},

	_bindUI: function () {
		var self = this;

		$(document).ready(self._handleDOMReady.bind(self));
		$(window).on('load', self._handleWindowLoad.bind(self));
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};