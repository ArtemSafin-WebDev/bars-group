var App = {

	_isFontsReady: function () {
		return $('html').hasClass('wf-active');
	},

	_initImagerJs: function () {
		new Imager('.js-imager-box img', { 
			availableWidths: [600, 1000], 
			availablePixelRatios: [1, 2],
			onImagesReplaced: function () {
				$(this.selector).each(function () {
					var src = $(this).attr('src');
					$(this).parent().css({ 'background-image': 'url(' + src + ')' });
				});
			}
		});
	},
	
	_handleDOMReady: function () {
		var self = this;

		var timer = setInterval(function () {
			if ( self._isFontsReady() ) {
				clearInterval(timer);

				// init modules here
				self._initImagerJs();
				Digits.init();
				Overview.init();
				GanttSlider.init();
				Header.init();
				News.init();
				Button.init();

				if (getScrollbarWidth() == 0) {
					$("html").addClass('hidden-scrollbar');
				}
			}
		}, 20);
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