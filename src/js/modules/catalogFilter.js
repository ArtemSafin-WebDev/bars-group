var $ = require('jquery');
var StickySidebar = require('sticky-sidebar');

module.exports = {

	_elems: {
		$popup: $(),
		$industries: $(),
		$searchMode: $(),
		$searchForm: $()
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
		self._elems.$searchMode.find('.nav-side__arrow').css({
			transform: 'translateY(' + $currItem.index() * 100 + '%)'
		});

		// toggle search form
		var isFormActive = !!$currItem.index();
		self._elems.$searchForm.toggleClass('--active', isFormActive);
	},

	_bindUI: function () {
		var self = this;

		self._elems.$industries.on('mouseenter', '.nav-video__item', {self: self}, self._handleIndustryMouseenter);
		self._elems.$industries.on('mouseleave', '.nav-video__item', {self: self}, self._handleIndustryMouseleave);
		self._elems.$industries.on('click', '.nav-video__item', {self: self}, self._handleIndustryClick);
		self._elems.$searchMode.on('click', '.nav-side__link', {self: self}, self._handleSearchModeClick);
	},

	init: function () {
		var self = this;

		var $popup = $('#portfolio-popup');
		var $industries = $('#portfolio-industries');
		var $searchMode = $('#portfolio-search-mode');
		var $searchForm = $('#portfolio-search-form');

		if ($industries.length == 0) return;

		self._elems.$popup = $popup;
		self._elems.$industries = $industries;
		self._elems.$searchMode = $searchMode;
		self._elems.$searchForm = $searchForm;

		self._stickSidebar();

		self._bindUI();
	}
};
