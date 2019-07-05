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
		GanttSlider.init();
		Header.init();
		News.init();
		NavSide.init();
		Form.init();

		if (getScrollbarWidth() == 0) {
			$("html").addClass('hidden-scrollbar');
		}
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