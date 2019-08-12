var $ = require('jquery');
require('objectFitPolyfill');
require('dragscroll');

var TechPromo = require('./techPromo');
var NavMobile = require('./navMobile');
var Overview = require('./overview');
var CatalogFilter = require('./catalogFilter');
var Hover = require('./hover');
var NavBanner = require('./navBanner');
var GanttSlider = require('./ganttSlider');
var CitiesSlider = require('./citiesSlider');
var SliderContent = require('./sliderContent');
var SliderDigits = require('./sliderDigits');
var SliderTabs = require('./sliderTabs');
var Header = require('./header');
var News = require('./news');
var Form = require('./form');
var ScrollableTable = require('./scrollableTable');
var NewsSlider = require('./newsSlider');
var NewsPhotoSlider = require('./newsPhotoSlider');
var NewsToggles = require('./newsToggles');
var NavSticker = require('./navSticker');
var About = require('./about');
var Talgat = require('./talgat');
var Utils = require('./utils');
var Popup = require('./popup');

module.exports = {

	_state: {
		preloaderTimer: null,
		promoVideosTotal: 0,
		promoVideosLoaded: 0,
		isUserActivityHandled: false,
		isWindowLoaded: false
	},

	_showContent: function () {
		var self = this;

		if ( self._state.isWindowLoaded === false ) return;
		if ( self._state.promoVideosLoaded !== self._state.promoVideosTotal) return;

		clearInterval(self._state.preloaderTimer);

		$('#hello').removeClass('hello--active');
		$('body').removeClass('page__locked');

		TechPromo.init();
		NavMobile.init();
		Overview.init();
		CatalogFilter.init();
		Hover.init();
		Popup.init();

		// trigger click to start loading lazy videos
		$('body').trigger('click');
	},

	_startLazyVideosLoading: function () {
		var self = this;

		$('video[data-lazy]').each(function () {
			$(this)[0].load();
		});
	},

	_handleUserActivity: function (e) {
		var self = e.data.self;

		if ( self._state.isUserActivityHandled ) return;
		if ( !Modernizr.video || Modernizr.lowbandwidth ) return;

		self._state.isUserActivityHandled = true;
		setTimeout(self._startLazyVideosLoading.bind(self), 100);
	},

	_handleDOMReady: function () {
		var self = this;

		// it's important to call NavBanner inition first,
		// because tabs content can contain other sliders inside
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

		objectFitPolyfill(this);
		$(this).addClass('--active');

		if ($(this).data('promo') !== undefined) {
			self._state.promoVideosLoaded++;
		}

		if ($(this).data('play') !== undefined) {
			$(this)[0].play();
		} 
	},

	_bindUI: function () {
		var self = this;

		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(window).on('load', self._handleWindowLoad.bind(self));
		$('video').one('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(self._handleDOMReady.bind(self));
	},

	init: function () {
		var self = this;

		if (Utils.isMobile()) {
			$('html').addClass('mrkwbr-is-mobile');
		} else {
			$('html').addClass('mrkwbr-no-mobile');
		}

		// count promo videos
		self._state.promoVideosTotal = $('video[data-promo]').length;

		// run preloader timer
		self._state.preloaderTimer = setInterval(self._showContent.bind(self), 50);

		self._bindUI();
	}
};