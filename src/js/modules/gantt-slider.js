
var GanttSlider = {

	_GANTT_ITEM_WIDTH: 510,
	_GANTT_SCENE_HEIGHT: 600,
	_GANTT_EDGE_OFFSET: 60,

	_PATTERN_ITEMS: [[310, 60], [25, 355], [200, 775], [370, 1070], [100, 1435], [410, 1760], [120, 2115]],
	_PATTERN_WIDTH: 2440,

	_state: {
		randomItems: [],
		isUserActivityHandled: false,
		isGanttView: false,
		savedSceneHeight: null,
		maxScrollLeft: null,
		lastRangeValue: null
	},

	_switchToGanttView: function () {
		var self = this;

		var $_ = $('#gantt-slider');
		var $scroll = $_.find('.gantt-slider__scroll');
		var $scene  = $_.find('.gantt-slider__scene');

		// get items to walk through
		var randomItems = self._state.randomItems;

		// calculate and set items positions 
		for (var i = 0, l = randomItems.length; i < l; i++) {
			// get item's position in 'lines' view
			var currTop     = parseInt($(randomItems[i]).offset().top - $scroll.offset().top);
			var currLeft    = parseInt($(randomItems[i]).offset().left + $scroll.scrollLeft());

			// get item's position in 'gantt' view
			var ganttTop    = self._getGanttItemTopPos(i); 
			var ganttLeft   = self._getGanttItemLeftPos(i);

			// get item's transform value
			var topOffset  = ganttTop  - currTop;
			var leftOffset = ganttLeft - currLeft;
			var transform  = 'translate3d(' + leftOffset + 'px,' + topOffset + 'px,0)';

			$(randomItems[i]).find('.gantt-slider__item__body').css({
				transform: transform,
				width: self._GANTT_ITEM_WIDTH
			});
		}

		// change styles to gantt mode
		self._state.isGanttView = true;
		self._state.savedSceneHeight = $scene.height();
		$scene.height(self._state.savedSceneHeight);
		$scene.height(self._GANTT_SCENE_HEIGHT);
		$('#gantt-slider').addClass('gantt-slider--gantt-view');
		self._makeScrollCalcs();

		function _isPositionInViewport(left) {
			return left - $scroll.scrollLeft() < $(window).width();
		}

	},

	_switchToLinesView: function () {
		var self = this;

		self._state.isGanttView = false;
		$('#gantt-slider .gantt-slider__scene').height(self._state.savedSceneHeight);
		$('#gantt-slider .gantt-slider__item__body').attr('style', '');
		$('#gantt-slider').removeClass('gantt-slider--gantt-view');
		self._makeScrollCalcs();

		setTimeout(function () {
			$('#gantt-slider .gantt-slider__scene').attr('style', '');
		}, 200);
	},



	_fillRandomItems: function () {
		var self = this;

		var lines = [];
		var items = [];
		var counter = 0;

		// group items by line
		$('#gantt-slider .gantt-slider__line').each(function () {
			var items = $.makeArray($(this).find('.gantt-slider__item')).reverse();
			counter += items.length;
			lines.push(items);
		});

		// take from each group
		var viewed = 0;
		while (viewed < counter) {
			lines.forEach(function (line) {
				if (line.length == 0) return;
				items.push(line.pop())
				viewed++;
			});
		};

		self._state.randomItems = items;
	},

	_getGanttItemTopPos: function (index) {
		var self = this;

		return self._PATTERN_ITEMS[self._convertToPatternIndex(index)][0];
	},

	_getGanttItemLeftPos: function (index) {
		var self = this;

		var factor = Math.floor(index / self._PATTERN_ITEMS.length);
		return self._PATTERN_ITEMS[self._convertToPatternIndex(index)][1] + self._PATTERN_WIDTH * factor;
	},

	_convertToPatternIndex: function (index) {
		var self = this;

		return index % self._PATTERN_ITEMS.length;
	},

	_makeScrollCalcs: function () {
		var self = this;

		var $scroll = $('#gantt-slider .gantt-slider__scroll');
		var $lines  = $('#gantt-slider .gantt-slider__line');
		var lineOffset = $lines.offset().left + $scroll.scrollLeft();

		if (self._state.isGanttView) {

			// 1. set grid width equal to last item right edge + edge offset
			var lastItemOffset = self._getGanttItemLeftPos(self._state.randomItems.length - 1);
			var gridWidth = lastItemOffset - lineOffset + self._GANTT_ITEM_WIDTH + self._GANTT_EDGE_OFFSET;

			// 2. calc maxScrollLeft
			var maxScrollLeft = gridWidth + lineOffset - $(window).width();

		} else {

			// 1. set grid width equal to max line width
			var maxWidth = 0;

			$lines.each(function () {
				var $lastItem = $(this).find('.gantt-slider__item').last();
				var lineWidth = $lastItem.offset().left - lineOffset + $lastItem.width();
				maxWidth = Math.max(maxWidth, lineWidth);
			});

			var gridWidth = maxWidth;

			// 2. calc maxScrollLeft
			var lastItemMargin = parseInt($('#gantt-slider .gantt-slider__item').last().css('margin-right'));
			var maxScrollLeft = gridWidth + lineOffset  + lastItemMargin - $(window).width();
		}

		$('#gantt-slider .gantt-slider__grid').width(gridWidth);
		
		if (maxScrollLeft < 0) maxScrollLeft = 0;
		self._state.maxScrollLeft = maxScrollLeft;

	},

	_initRangeSlider: function () {
		var self = this;

		var $range = $('#gantt-slider .gantt-slider__range');
		$range.find('input').rangeslider({
			polyfill: false,
			onInit: function () {
				$range.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
			},
			onSlide: _.throttle(function(position, value) {
				if (value == self._state.lastRangeValue) return;
				self._state.lastRangeValue = value;
				
				var isHandleActive = $range.find('.rangeslider').hasClass('rangeslider--active');
				if (!isHandleActive) return;

				var scrollLeft = self._state.maxScrollLeft / 1000 * value; 
				$('#gantt-slider .gantt-slider__scroll').scrollLeft(scrollLeft);
			}, 50)
		});

	},

	_startVideoLoading: function () {
		var self = this;

		$('#gantt-slider video').each(function () {
			$(this)[0].load();
		});
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
		$(this).addClass('_active');
	},

	_handleMouseOver: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video._active');
		if ($video.length) {
			$video[0].play();
		}
	},

	_handleMouseOut: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video._active');
		if ($video.length) {
			$video[0].pause();
		}
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._makeScrollCalcs();
	},

	_handleSliderScroll: function (e) {
		var self = e.data.self;

		var scrollLeft = $('#gantt-slider .gantt-slider__scroll').scrollLeft();
		var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
		$('#gantt-slider .gantt-slider__range input').val(rangeValue).change();
	},

	_handleToggleButton: function (e) {
		var self = e.data.self;

		if (self._state.isGanttView) {
			self._switchToLinesView();
		} else {
			self._switchToGanttView();
		}
	},

	_bindUI: function () {
		var self = this;

		$('.gantt-slider__scroll').on('scroll', {self: self}, _.throttle(self._handleSliderScroll, 50));
		$('.gantt-slider__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(document).on('mouseover', '.gantt-slider__item', {self: self}, self._handleMouseOver);
		$(document).on('mouseout', '.gantt-slider__item', {self: self}, self._handleMouseOut);
		$(document).on('click', '.gantt-slider__toggle', {self: self}, self._handleToggleButton);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#gantt-slider').length == 0 ) return;

		self._makeScrollCalcs();
		self._initRangeSlider();
		self._fillRandomItems();
		self._bindUI();

		$('body').trigger('click');
	}

};