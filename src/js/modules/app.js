var App = {

	_elems: {
		$promoVideos: $()
	},

	_state: {
		preloaderTimer: null,
		promoVideosLoaded: 0,
		isWindowLoaded: false
	},

	_showContent: function () {
		var self = this;

		if ( self._state.isWindowLoaded === false ) return;
		if ( self._state.promoVideosLoaded !== self._elems.$promoVideos.length) return;

		clearInterval(self._state.preloaderTimer);

		$('#hello').removeClass('hello--active');
		$('body').removeClass('page__locked');
	},

	_handleDOMReady: function () {
		var self = this;

		// init modules here
		GanttSlider.init();
		CitiesSlider.init();
		SliderContent.init();
		SliderDigits.init();
		SliderTabs.init();
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
		NavSticker.init();
	},

	_handleWindowLoad: function () {
		var self = this;

		self._state.isWindowLoaded = true;
	},

	_handleCanPlayEvent: function (e) {
		var self = e.data.self;

		self._state.promoVideosLoaded++;
	},

	_bindUI: function () {
		var self = this;

		self._elems.$promoVideos.on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(window).on('load', self._handleWindowLoad.bind(self));
		$(self._handleDOMReady.bind(self));
	},

	init: function () {
		var self = this;

		// check promo videos
		self._elems.$promoVideos = $('video[data-promo]');

		// run preloader timer
		self._state.preloaderTimer = setInterval(self._showContent.bind(self), 50);

		self._bindUI();
	}
};