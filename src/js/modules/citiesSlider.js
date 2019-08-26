var $ = require('jquery');
require("rangeslider.js");

module.exports = {

	_cache: {
		gantt: {}
	},
	
	_elems: {
		$_: $(),
		$sandbox: $(),
		$scroll: $(),
		$canvas: $(),
		$items: $(),
		$ctrl: $(),
		$range: $(),
		$itemClone: $()
	},

	_state: {
		maxScrollLeft: 0,
		lastRangeValue: 0,
		lastZIndex: 50,
		lastScrollTop: 0,
		timeout: null
	},

	_getGanttPattern: function (width, height) {
		var self = this;

		// imagine, that we have some picture, which contains 7 rectangles.
		// pattern object properties describe how we can draw the picture
		var PATTERN = {
			canvasWidth: 2440,
			canvasHeight: 600,
			rectWidth: 510,
			rectHeight: 160,
			coords: [ [60, 310], [355, 25], [775, 200], [1070, 370], [1435, 100], [1760, 410], [2115, 120] ]
		};

		// items' width and height will change on different screen sizes
		// so we need to have a pattern suitable for new item's dimensions
		var result = {};
		result.canvasWidth = parseInt(PATTERN.canvasWidth / PATTERN.rectWidth * width);
		result.canvasHeight = parseInt(PATTERN.canvasHeight / PATTERN.rectHeight * height);
		result.coords = [];
		PATTERN.coords.forEach(function (coord) {
			result.coords.push([
				parseInt(coord[0] / PATTERN.canvasWidth * result.canvasWidth),
				parseInt(coord[1] / PATTERN.canvasHeight * result.canvasHeight)
			]);
		});

		return result;
	},

	// create elems clone to get their dimenstions
	_createElemsClones: function () {
		var self = this;

		var $itemClone = self._elems.$items.eq(0).clone();
		$itemClone.appendTo(self._elems.$sandbox);
		self._elems.$itemClone = $itemClone;
	},

	_getGanttViewCalcs: function () {
		var self = this;

		// get vars for cacheId
		var itemWidth  = self._elems.$itemClone.outerWidth();
		var itemHeight = self._elems.$itemClone.outerHeight();

		var cacheId = itemWidth + 'x' + itemHeight;
		if ( !self._cache.gantt[cacheId] ) {

			var result = {
				canvas: {},
				items: []
			};

			// save items positions
			var pattern = self._getGanttPattern(itemWidth, itemHeight);
			var maxLeftPos = 0;

			self._elems.$items.each(function (index, item) {
				var baseIndex = index % pattern.coords.length;
				var factor = Math.floor(index / pattern.coords.length);

				var leftPos = pattern.coords[baseIndex][0] + pattern.canvasWidth * factor;
				var topPos = pattern.coords[baseIndex][1];

				result.items[index] = {
					left: leftPos,
					top: topPos
				};

				if (leftPos > maxLeftPos) maxLeftPos = leftPos;
			});

			// save canvas size
			result.canvas.width = maxLeftPos + itemWidth + pattern.coords[0][0];
			result.canvas.height = pattern.canvasHeight;

			self._cache.gantt[cacheId] = result;
		}

		return self._cache.gantt[cacheId];
	},

	_setItemsPositions: function () {
		var self = this;
		
		var calcs = self._getGanttViewCalcs();		
		var canvasMiddle = calcs.canvas.height / 2;
		var itemHeight = self._elems.$itemClone.outerHeight();

		// set items positions
		self._elems.$items.each(function (index, item) {

			if ( calcs.items[index].top > canvasMiddle ) {
				$(item).css({ 
					left: calcs.items[index].left, 
					bottom: calcs.canvas.height - itemHeight - calcs.items[index].top,
					top: 'auto'
				});
			} else {
				$(item).css({ 
					left: calcs.items[index].left, 
					top: calcs.items[index].top,
					bottom: 'auto'
				});
			}

			
		});

		// set canvas size
		self._elems.$canvas.css({
			width: calcs.canvas.width,
			height: calcs.canvas.height
		});

		self._updateScrollCalcs();
	},

	_updateScrollCalcs: function () {
		var self = this;

		// update maxScrollLeft
		var maxScrollLeft = self._elems.$canvas.width() - $(window).width();
		self._elems.$range.toggleClass('cities-slider__range--hidden', maxScrollLeft < 0);
		self._state.maxScrollLeft = maxScrollLeft;

		// update handle position
		self._updateHandlePosition();
	},

	_updateHandlePosition: function () {
		var self = this;

		var scrollLeft = self._elems.$scroll.scrollLeft();
		var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
		self._elems.$range.find('input').val(rangeValue).change();
	},

	_initRangeSlider: function () {
		var self = this;

		var $rangeslider = $();

		self._elems.$range.find('input').rangeslider({
			polyfill: false,
			onInit: function () {
				$rangeslider = self._elems.$range.find('.rangeslider');
				$rangeslider.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
			},
			onSlide: function(position, value) {
				if (value == self._state.lastRangeValue) return;
				self._state.lastRangeValue = value;
				
				var isHandleActive = $rangeslider.hasClass('rangeslider--active');
				if (!isHandleActive) return;

				var scrollLeft = self._state.maxScrollLeft / 1000 * value; 
				self._elems.$scroll.scrollLeft(scrollLeft);
			}
		});

	},

	_handleSliderScroll: function (e) {
		var self = this;

		self._updateHandlePosition();
	},

	_handleItemMouseenter: function (e) {
		var self = e.data.self;

		$(this).find('.cities-slider__item__collapse').stop().slideDown();
		$(this).css({ 'z-index': ++self._state.lastZIndex });
	},

	_handleItemMouseleave: function (e) {
		var self = e.data.self;

		$(this).find('.cities-slider__item__collapse').stop().slideUp();
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setItemsPositions();
	},

	_handleWindowScroll: function (e) {
		var self = this;

		if (!Modernizr.requestanimationframe) return;
		if (!Modernizr.hiddenscroll) return;

		if (self._state.timeout) {
			window.cancelAnimationFrame(self._state.timeout);
		}

		self._state.timeout = window.requestAnimationFrame(function () {
			var scrollTop  = $(window).scrollTop();
			var delta  = self._state.lastScrollTop - scrollTop;
			var scrollLeft = self._elems.$scroll.scrollLeft() - delta;
			self._elems.$scroll.scrollLeft(scrollLeft)
			self._state.lastScrollTop = scrollTop;
		});
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('mouseenter', '.cities-slider__item', {self: self}, self._handleItemMouseenter);
		self._elems.$_.on('mouseleave', '.cities-slider__item', {self: self}, self._handleItemMouseleave);
		$(window).on('resize', {self: self}, self._handleWindowResize);

		self._elems.$scroll[0].addEventListener('scroll', self._handleSliderScroll.bind(self), false);
		window.addEventListener('scroll', self._handleWindowScroll.bind(self), false);
	},

	init: function () {
		var self = this;

		var $_ = $('#cities-slider');
		if ( $_.length == 0 ) return;
		
		self._elems.$_ = $_;
		self._elems.$sandbox = $('#cities-slider-sandbox');
		self._elems.$scroll = $_.find('.cities-slider__scroll');
		self._elems.$canvas = $_.find('.cities-slider__canvas');
		self._elems.$items = $_.find('.cities-slider__item');
		self._elems.$ctrl = $_.find('.cities-slider__ctrl');
		self._elems.$range = $_.find('.cities-slider__range');

		self._createElemsClones();
		self._setItemsPositions();
		self._initRangeSlider();

		self._elems.$_.removeClass('cities-slider--frozen _loading');

		self._bindUI();
	}

};