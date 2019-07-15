var App = {

	_initImagerJs: function () {
		new Imager('.js-imager-box img', { 
			availableWidths: [1000, 1500], 
			availablePixelRatios: [1],
			onImagesReplaced: function () {
				$(this.selector).each(function () {
					var src = $(this).attr('src');
					$(this).parent().addClass('--inited').css({ 'background-image': 'url(' + src + ')' });
				});
			}
		});
	},
	
	_handleDOMReady: function () {
		var self = this;

		// init modules here
		self._initImagerJs();
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