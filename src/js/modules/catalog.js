var $ = require('jquery');
var StickySidebar = require('sticky-sidebar');
var notify = require('./notify');

module.exports = {

	_elems: {
		$_: $(),
		$ctrlFilter: $(),
		$ctrlModes: $(),
		$searchForm: $(),
		$tiles: $(),
		$names: $(),
		$popup: $(),
		$industries: $()
	},

	_state: {
		stickySidebar: null,
		searchText: '',
		letter: '',
		industry: '',
		customer: '',
		type: ''
	},

	_stickSidebar: function () {
		var self = this;

		self._state.stickySidebar = new StickySidebar('.js-sidebar', {
		    topSpacing: 20,
		    bottomSpacing: 20,
		    innerWrapperSelector: '.js-sidebar-inner',
		    containerSelector: '.js-sidebar-root'
		});
	},

	_renderSearchView: function () {
		var self = this;

		self._elems.$_.find('.js-catalog-search').each(function () {
			if ($(this).val() == self._state.searchText) return;
			$(this).val(self._state.searchText).trigger('change');
		});
	},

	_renderTilesView: function () {
		var self = this;

		// prepare url
		var url = self._elems.$_.data('tiles-url')
			.replace('{industry}', self._state.industry)
			.replace('{customer}', self._state.customer)
			.replace('{type}', self._state.type);

		// show common loader
		$('#loader-ajax').addClass('--active');

		// set industry loader
		self._elems.$industries
			.removeClass('--active --loading')
			.filter(`[data-id="${self._state.industry}"]`).addClass('--loading');

		$.ajax({
            method: 'get',
			url: url,
			dataType: 'html'
		})
		.done(function (data) {
			
			// hide content
			setTimeout(function () {
				self._elems.$_.addClass('--replace');
			}, 200);

			// update content
			setTimeout(function () {
				self._elems.$names.removeClass('--active');
				self._elems.$tiles.addClass('--active').html(data);
				self._elems.$ctrlFilter.removeClass('--disabled');
				self._state.stickySidebar.updateSticky();
			}, 400);

			// show content
			setTimeout(function () {
				self._elems.$_.removeClass('--replace');
			}, 800);

			// set active class
			self._elems.$industries
				.filter(`[data-id="${self._state.industry}"]`).addClass('--active');
		})
		.fail(function (jqXHR, textStatus) {
			// notify error
			notify('Catalog ajax fail.', textStatus);
		})
		.always(function () {
			// hide common loader
			$('#loader-ajax').removeClass('--active');
		});

	},

	_renderNamesView: function () {
		var self = this;

		// prepare url
		var url = self._elems.$_.data('names-url')
			.replace('{search}', self._state.searchText)
			.replace('{letter}', self._state.letter);

		// clear state 
		self._state.letter = '';

		// show common loader
		$('#loader-ajax').addClass('--active');

		$.ajax({
            method: 'get',
			url: url,
			dataType: 'html'
		})
		.done(function (data) {
			
			// hide content
			setTimeout(function () {
				self._elems.$_.addClass('--replace');
			}, 200);

			// update content
			setTimeout(function () {
				self._elems.$tiles.removeClass('--active');
				self._elems.$names.addClass('--active').html(data);
				self._elems.$ctrlFilter.addClass('--disabled');
				self._state.stickySidebar.updateSticky();
			}, 400);

			// show content
			setTimeout(function () {
				self._elems.$_.removeClass('--replace');
			}, 800);
		})
		.fail(function (jqXHR, textStatus) {
			// notify error
			notify('Catalog ajax fail.', textStatus);
		})
		.always(function () {
			// hide common loader
			$('#loader-ajax').removeClass('--active');
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

		var id = $(this).data('id');
		self._state.industry = (self._state.industry === id) ? '' : id;
		self._renderTilesView();
	},

	_handleCtrlModesLink: function (e) {
		var self = e.data.self;

		e.preventDefault()

		var $currItem = $(this).closest('.nav-side__item');
		if ($currItem.hasClass('--active')) return;

		// set active class
		$currItem.addClass('--active').siblings().removeClass('--active');

		// set arrow position
		self._elems.$ctrlModes.find('.nav-side__arrow').css({
			transform: 'translateY(' + $currItem.index() * 100 + '%)'
		});

		// toggle search form
		var isFormActive = !!$currItem.index();
		self._elems.$searchForm.toggleClass('--active', isFormActive);

		// clear state
		self._state.searchText = '',
		self._state.letter = '',
		self._state.industry = '',
		self._state.customer = '',
		self._state.type = ''

		switch ($currItem.data('id')) {
			case 'names':
				self._renderNamesView();
			break;
			case 'tiles':
				self._renderTilesView();
			break;
		}
	},

	_handleSearchKeyup: function (e) {
		var self = e.data.self;

		self._state.searchText = $(this).val();
		self._renderSearchView();
	},

	_handleLetterClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._state.letter = $(this).text();
		self._renderNamesView();
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('mouseenter', '.nav-video__item', {self: self}, self._handleIndustryMouseenter);
		self._elems.$_.on('mouseleave', '.nav-video__item', {self: self}, self._handleIndustryMouseleave);
		self._elems.$_.on('click', '.nav-video__item', {self: self}, self._handleIndustryClick);
		self._elems.$_.on('click', '.nav-side__link', {self: self}, self._handleCtrlModesLink);
		self._elems.$_.on('keyup', '.js-catalog-search', {self: self}, self._handleSearchKeyup);
		self._elems.$_.on('click', '.tPortfolioSearch__lang a', {self: self}, self._handleLetterClick);
	},

	init: function () {
		var self = this;

		var $_ = $('#catalog');
		
		if ( $_.length == 0 ) return;

		self._elems.$_ = $_;
		self._elems.$ctrlModes = $('#catalog-ctrl-modes');
		self._elems.$ctrlFilter = $('#catalog-ctrl-filter');
		self._elems.$searchForm = $('#catalog-search-form');
		self._elems.$tiles = $('#catalog-tiles');
		self._elems.$names = $('#catalog-names');
		self._elems.$popup = $('#catalog-popup');
		self._elems.$industries = $_.find('.nav-video__item');

		self._stickSidebar();

		self._bindUI();
	}
};
