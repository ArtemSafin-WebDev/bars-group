
var GanttSlider = {

	_cache: {
		gantt: {}
	},
	
	_elems: {
		$_: $(),
		$sandbox: $(),
		$inner: $(),
		$scroll: $(),
		$canvas: $(),
		$types: $(),
		$lines: $(),
		$items: $(),
		$ctrl: $(),
		$range: $(),
		$itemClone: $(),
		$typeClone: $()
	},

	_state: {
		currentView: 'gantt',
		groupedItems: [],
		randomItems: [],
		maxScrollLeft: 0,
		lastRangeValue: 0
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

		var $typeClone = self._elems.$types.eq(0).clone();
		$typeClone.appendTo(self._elems.$sandbox);
		self._elems.$typeClone = $typeClone;
	},

	_sortItemsByGroup: function () {
		var self = this;

		var groupedItems = [];
		self._elems.$items.each(function (index, item) {
			var id = $(item).data('rel');
			if (typeof groupedItems[id] === 'undefined') groupedItems[id] = [];
			groupedItems[id].push(item);
		});
		self._state.groupedItems = groupedItems;
	},

	// picks items from different groups and puts them into one array
	_sortItemsRandomly: function () {
		var self = this;

		var totalCount = 0;
		var helperArray = [];
		self._state.groupedItems.forEach(function (items, index) {
			helperArray[index] = items.slice().reverse();
			totalCount += items.length;
		});

		var randomItems = [];
		var viewedCount = 0;
		while (viewedCount < totalCount) {
			helperArray.forEach(function (items) {
				if (items.length == 0) return;
				randomItems.push(items.pop())
				viewedCount++;
			});
		};

		self._state.randomItems = randomItems;
	},

	_getGanttViewCalcs: function () {
		var self = this;

		// get vars for cacheId
		var itemWidth = self._elems.$itemClone.outerWidth();
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

			self._state.randomItems.forEach(function (item, index) {
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

	_switchToGanttView: function () {
		var self = this;

		self._elems.$_.addClass('gantt-slider--gantt-view');
		self._elems.$sandbox.addClass('gantt-slider--gantt-view');
		
		var calcs = self._getGanttViewCalcs();		

		// set items positions
		self._state.randomItems.forEach(function (item, index) {
			$(item).css({ 
				left: calcs.items[index].left, 
				top: calcs.items[index].top 
			});
		});

		// set canvas size
		self._elems.$canvas.css({
			width: calcs.canvas.width,
			height: calcs.canvas.height
		});


		self._state.currentView = 'gantt';
		self._updateScrollCalcs();
	},

	_switchToLinesView: function () {
		var self = this;

		self._elems.$_.removeClass('gantt-slider--gantt-view');
		self._elems.$sandbox.removeClass('gantt-slider--gantt-view');

		// inner offset
		var innerOffset = parseInt(self._elems.$inner.css('padding-left'));

		// get item dimentions
		var itemWidth = self._elems.$itemClone.outerWidth();
		var itemHeight = self._elems.$itemClone.outerHeight();
		var itemOffsetY = parseInt(self._elems.$itemClone.css('margin-bottom')); 
		var itemOffsetX = parseInt(self._elems.$itemClone.css('margin-right')); 

		// get type dimensions
		var typeWidth = self._elems.$typeClone.width();

		// get start pos
		var centerStart = self._elems.$ctrl.offset().left;

		var lineCounter = 0;
		var maxLeftPos = 0;
		var maxTopPos = 0;

		self._state.groupedItems.forEach(function (items, index) {
			var topPos = lineCounter * (itemHeight + itemOffsetY);

			// items
			items.forEach(function (item, index) {
				var leftPos = centerStart + typeWidth + index * (itemWidth + itemOffsetX);
				$(item).css({ top: topPos, left: leftPos });

				if (leftPos > maxLeftPos) maxLeftPos = leftPos;
			});

			// types
			self._elems.$types.filter('[data-rel="' + index + '"]').css({
				top: topPos,
				left: centerStart
			});

			// lines
			self._elems.$lines.filter('[data-rel="' + index + '"]').css({
				top: topPos,
				left: centerStart
			});

			if (topPos > maxTopPos) maxTopPos = topPos;
			lineCounter++;
		});

		// set lines size 
		self._elems.$lines.css({
			width: maxLeftPos + itemWidth - centerStart
		});

		// set canvas size
		self._elems.$canvas.css({
			width: maxLeftPos + itemWidth + innerOffset,
			height: maxTopPos + itemHeight + itemOffsetY
		});

		self._state.currentView = 'lines';
		self._updateScrollCalcs();
	},

	_updateScrollCalcs: function () {
		var self = this;

		// update maxScrollLeft
		var maxScrollLeft = self._elems.$canvas.width() - $(window).width();
		self._elems.$range.toggleClass('gantt-slider__range--hidden', maxScrollLeft < 0);
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


	_startVideoLoading: function () {
		var self = this;

		self._elems.$_.find('video').each(function () {
			$(this)[0].load();
		});
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		switch (self._state.currentView) {
			case 'gantt': 
				self._switchToGanttView();
			break;
			case 'lines': 
				self._switchToLinesView();
			break;
		}
	},

	_handleToggleButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		switch (self._state.currentView) {
			case 'gantt': 
				self._switchToLinesView();
			break;
			case 'lines': 
				self._switchToGanttView();
			break;
		}
	},

	_handleUserActivity: function (e) {
		var self = e.data.self;

		if ( self._state.isUserActivityHandled ) return;
		if ( !Modernizr.video || Modernizr.lowbandwidth ) return;

		self._state.isUserActivityHandled = true;
		setTimeout(self._startVideoLoading.bind(self), 100);
	},

	_handleCanPlayEvent: function (e) {
		var self = e.data.self;

		objectFitPolyfill(this);
		$(this).addClass('--active');
	},

	_handleMouseOver: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].play();
	},

	_handleMouseOut: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].pause();
	},

	_handleSliderScroll: function (e) {
		var self = e.data.self;

		self._updateHandlePosition();
	},

	_bindUI: function () {
		var self = this;

		self._elems.$scroll.on('scroll', {self: self}, self._handleSliderScroll);
		self._elems.$_.on('canplaythrough', '.gantt-slider__bg__video', {self: self}, self._handleCanPlayEvent);
		self._elems.$_.on('mouseover', '.gantt-slider__item', {self: self}, self._handleMouseOver);
		self._elems.$_.on('mouseout', '.gantt-slider__item', {self: self}, self._handleMouseOut);
		self._elems.$_.on('click', '.gantt-slider__toggle', {self: self}, self._handleToggleButton);
		
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		var $_ = $('#gantt-slider');
		if ( !$_.length ) return;
		
		self._elems.$_ = $_;
		self._elems.$sandbox = $('#gantt-slider-sandbox');
		self._elems.$inner = $_.find('.page__inner').first();
		self._elems.$scroll = $_.find('.gantt-slider__scroll');
		self._elems.$canvas = $_.find('.gantt-slider__canvas');
		self._elems.$types = $_.find('.gantt-slider__type');
		self._elems.$lines = $_.find('.gantt-slider__line');
		self._elems.$items = $_.find('.gantt-slider__item');
		self._elems.$ctrl = $_.find('.gantt-slider__ctrl');
		self._elems.$range = $_.find('.gantt-slider__range');

		self._createElemsClones();
		self._sortItemsByGroup();
		self._sortItemsRandomly();
		self._switchToGanttView();
		self._initRangeSlider();

		self._elems.$_.removeClass('gantt-slider--frozen --loading');

		self._bindUI();
	}

};