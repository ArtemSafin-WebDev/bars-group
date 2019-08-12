var $ = require('jquery');
var StickySidebar = require('sticky-sidebar');

module.exports = {

	_elems: {
		$_: $(),
		$ctrlMain: $(),
		$ctrlFilter: $(),
		$ctrlModes: $(),
		$searchForm: $(),
		$popup: $()
	},

	_stickSidebar: function () {
		var self = this;

		new StickySidebar('.js-sidebar', {
		    topSpacing: 20,
		    bottomSpacing: 20,
		    innerWrapperSelector: '.js-sidebar-inner',
		    containerSelector: '.js-sidebar-root'
		});
	},

	_handleIndustryMouseenter: function (e) {
		var self = e.data.self;

		if ($(this).hasClass('--active')) return;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].play();
	},

	_handleIndustryMouseleave: function (e) {
		var self = e.data.self;

		if ($(this).hasClass('--active')) return;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].pause();
	},

	_handleIndustryClick: function (e) {
		var self = e.data.self;

		$(this).toggleClass('--active').siblings().removeClass('--active');
	},

	_handleSearchModeClick: function (e) {
		var self = e.data.self;

		e.preventDefault()

		// set active class
		var $currItem = $(this).closest('.nav-side__item');
		$currItem.addClass('--active').siblings().removeClass('--active');

		// set arrow position
		self._elems.$ctrlModes.find('.nav-side__arrow').css({
			transform: 'translateY(' + $currItem.index() * 100 + '%)'
		});

		// toggle search form
		var isFormActive = !!$currItem.index();
		self._elems.$searchForm.toggleClass('--active', isFormActive);
	},

	_bindUI: function () {
		var self = this;

		self._elems.$ctrlMain.on('mouseenter', '.nav-video__item', {self: self}, self._handleIndustryMouseenter);
		self._elems.$ctrlMain.on('mouseleave', '.nav-video__item', {self: self}, self._handleIndustryMouseleave);
		self._elems.$ctrlMain.on('click', '.nav-video__item', {self: self}, self._handleIndustryClick);
		self._elems.$ctrlModes.on('click', '.nav-side__link', {self: self}, self._handleSearchModeClick);
	},

	init: function () {
		var self = this;

		var $_ = $('#catalog');
		
		if ( $_.length == 0 ) return;

		var $ctrlModes = $('#catalog-ctrl-modes');
		var $ctrlFilter = $('#catalog-ctrl-filter');
		var $ctrlMain = $('#catalog-ctrl-main');
		var $searchForm = $('#catalog-search-form');
		var $popup = $('#catalog-popup');

		self._elems.$_ = $_;
		self._elems.$ctrlModes = $ctrlModes;
		self._elems.$ctrlFilter = $ctrlFilter;
		self._elems.$ctrlMain = $ctrlMain;
		self._elems.$searchForm = $searchForm;
		self._elems.$popup = $popup;

		self._stickSidebar();

		self._bindUI();
	}
};
