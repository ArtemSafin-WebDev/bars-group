var App = {
	
	_handleDOMReady: function () {
		var self = this;

		// init modules here
		Overview.init();
		SliderContent.init();
		SliderDigits.init();
		SliderTabs.init();
		GanttSlider.init();
		Header.init();
		News.init();
		Form.init();
		ScrollableTable.init();
		NewsSlider.init();
		NewsPhotoSlider.init();
		NewsToggles.init();
		NavBanner.init();
		TechPromo.init();
	},

	_bindUI: function () {
		var self = this;

		$(document).ready(self._handleDOMReady.bind(self));
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};