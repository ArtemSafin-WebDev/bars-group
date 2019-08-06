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

		TechPromo.init();
	},

	_handleDOMReady: function () {
		var self = this;

		// it's important to call NavBanner inition first,
		// because tabs contents can have owl-carousel blocks inside
		NavBanner.init();

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
		
		Overview.init();
		NavMobile.init();
		NavSticker.init();
		About.init();
		Talgat.init();
	},

	_handleWindowLoad: function () {
		var self = this;

		self._state.isWindowLoaded = true;
	},

	_handleCanPlayEvent: function (e) {
		var self = e.data.self;

		self._state.promoVideosLoaded++;

		objectFitPolyfill(this);
		$(this).addClass('--active');

		// tech-promo case
		if ( $(this).parent().hasClass('--active') ) {
			$(this)[0].play();
		}
	},

	_bindUI: function () {
		var self = this;

		self._elems.$promoVideos.one('canplaythrough', {self: self}, self._handleCanPlayEvent);
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