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
		currentMode: 'tiles',
		filter: {
			customer: {
				counts: {},
				value: 'total'
			},
			type: {
				counts: {},
				value: 'total'
			},
		},
		searchText: '',
		letter: '',
		industry: ''
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

	_renderCurrentView: function ( ) {
		var self = this;

		switch (self._state.currentMode) {
			case 'names':
				self._renderNamesView();
			break;
			case 'tiles':
				self._renderTilesView();
			break;
		}
	},

	_renderFiltersView: function () {
		var self = this;

		// update side filter
		self._elems.$ctrlFilter.find('.nav-cats').each(function () {
			var filterId = $(this).data('id');
			var filterState = self._state.filter[filterId];
			$(this).find('.nav-cats__item').each(function () {
				var filterItemId = $(this).data('id');
				var isItemActive = filterState.value == filterItemId;
				$(this).find('.nav-cats__count').html(filterState.counts[filterItemId]);
				$(this).toggleClass('--active', isItemActive);
			});
		});

		// update popup filter
		self._elems.$popup.find('input').each(function () {
			var filterId = $(this).attr('name');
			var filterItemId = $(this).attr('value');
			var filterState = self._state.filter[filterId];
			var isChecked = filterState.value == filterItemId;
			$(this)
				.prop('checked', isChecked).iCheck('update').trigger('ifToggled')
				.closest('.form-filter__item').find('.form-filter__count')
				.html(filterState.counts[filterItemId]);
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
			.replace('{customer}', self._state.filter.customer.value)
			.replace('{type}', self._state.filter.type.value);

		// clear state
		self._state.searchText = '';

		// reset search forms view
		self._renderSearchView();

		// show common loader
		$('#loader-ajax').addClass('--active');

		// set industry loader
		self._renderIndustries('--loading');

		$.ajax({
            method: 'get',
			url: url,
			dataType: 'json',
			cache: false
		})
		.done(function (data) {

			self._state.filter.customer.counts = data.filterCounts.customer;
			self._state.filter.type.counts = data.filterCounts.type;
			
			// hide content
			setTimeout(function () {
				self._elems.$_.addClass('--replace');
			}, 200);

			// update content
			setTimeout(function () {
				self._elems.$names.removeClass('--active');
				self._elems.$tiles.addClass('--active').html(data.result);
				self._state.stickySidebar.updateSticky();
				self._renderFiltersView();
			}, 400);

			// show content
			setTimeout(function () {
				self._elems.$_.removeClass('--replace');
			}, 800);

			// set active class
			self._renderIndustries('--active');
		})
		.fail(function (jqXHR, textStatus) {
			// notify error
			notify('Ошибка при загрузке.', textStatus);
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
			.replace('{searchText}', self._state.searchText)
			.replace('{letter}', self._state.letter)
			.replace('{customer}', self._state.filter.customer.value)
			.replace('{type}', self._state.filter.type.value);

		// clear state 
		self._state.letter = '';
		self._state.industry = '';

		// reset industry view
		self._renderIndustries();

		// show common loader
		$('#loader-ajax').addClass('--active');

		$.ajax({
            method: 'get',
			url: url,
			dataType: 'json',
			cache: false
		})
		.done(function (data) {

			self._state.filter.customer.counts = data.filterCounts.customer;
			self._state.filter.type.counts = data.filterCounts.type;
			
			// hide content
			setTimeout(function () {
				self._elems.$_.addClass('--replace');
			}, 200);

			// update content
			setTimeout(function () {
				self._elems.$tiles.removeClass('--active');
				self._elems.$names.addClass('--active').html(data.result);
				self._state.stickySidebar.updateSticky();
				self._renderFiltersView();
			}, 400);

			// show content
			setTimeout(function () {
				self._elems.$_.removeClass('--replace');
			}, 800);
		})
		.fail(function (jqXHR, textStatus) {
			// notify error
			notify('Ошибка при загрузке.', textStatus);
		})
		.always(function () {
			// hide common loader
			$('#loader-ajax').removeClass('--active');
		});

	},

	_renderIndustries: function (className) {
		var self = this;

		var className = className || '';

		self._elems.$industries
			.removeClass('--active --loading')
			.filter(`[data-id="${self._state.industry}"]`).addClass(className);
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

		self._state.currentMode = $currItem.data('id');
		
		self._renderCurrentView();
		self._renderSearchView();
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

	_handleFormSubmit: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._renderNamesView();
	},

	_handleFilterLink: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var filterId = $(this).closest('.nav-cats').data('id');
		self._state.filter[filterId].value = $(this).closest('.nav-cats__item').data('id');

		self._renderCurrentView();
	},

	_handlePopupReset: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._state.filter.customer.value = 'total';
		self._state.filter.type.value = 'total';
		self._renderCurrentView();
		$.fancybox.close();
	},

	_handlePopupApply: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		var $popup = self._elems.$popup;
		self._state.filter.customer.value = $popup.find('[name="customer"]:checked').val();
		self._state.filter.type.value = $popup.find('[name="type"]:checked').val();
		self._renderCurrentView();
		$.fancybox.close();
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('mouseenter', '.nav-video__item', {self: self}, self._handleIndustryMouseenter);
		self._elems.$_.on('mouseleave', '.nav-video__item', {self: self}, self._handleIndustryMouseleave);
		self._elems.$_.on('click', '.nav-video__item', {self: self}, self._handleIndustryClick);
		self._elems.$_.on('click', '.nav-side__link', {self: self}, self._handleCtrlModesLink);
		self._elems.$_.on('keyup', '.js-catalog-search', {self: self}, self._handleSearchKeyup);
		self._elems.$_.on('click', '.tPortfolioSearch__lang a', {self: self}, self._handleLetterClick);
		self._elems.$_.on('submit', '.js-catalog-form', {self: self}, self._handleFormSubmit);
		self._elems.$_.on('click', '.nav-cats__link', {self: self}, self._handleFilterLink);
		self._elems.$popup.on('click', '.form-filter__reset', {self: self}, self._handlePopupReset);
		self._elems.$popup.on('click', '.js-catalog-apply', {self: self}, self._handlePopupApply);
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
