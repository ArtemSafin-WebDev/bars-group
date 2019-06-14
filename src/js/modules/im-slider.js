
var ImSlider = {

	_state: {
		currView: 'lines',
		isUserActivityHandled: false,
		maxListWidth: null,
		maxScrollLeft: null,
		lastRangeValue: null
	},

	_switchToGantView: function () {
		var self = this;

		// to add some random (but repeatable) effect to items 
		var widthFactors = Array(15).join('1.0|1.3|1.0|1.2|1.0|1.2|1.3|1.1|1.2|').split('|');
		var leftFactors  = ('0.8|0.1|0.5|' + Array(15).join('0.3|0.4|0.4|0.3|0.3|0.5|0.4|0.3|0.3|')).split('|');

		// prepare items to walk one by one and put into lines
		var items = _getSortedListOfItems();
		
		// get dimentions for items positions calculation
		var itemsHeight = $(items[0]).outerHeight();
		var itemsWidth  = $(items[0]).outerWidth();
		var currSceneHeight = $('#im-slider .im-slider__scene').height();
		var gantSceneHeight = 600;
		var linesCount  = 3;
		var linesHeight = Math.round(gantSceneHeight / linesCount);

		// place, where the length of the line will be saved
		var linesEdges = [0, 0, 0];

		// calculate items positions and sizes
		for (var i = 0, l = items.length; i < l; i++) {
			var lineIndex = _getShortestLineIndex();

			// get item's position in 'lines' view
			var $scrollBox = $('#im-slider .im-slider__scroll');
			var currTop    = parseInt($(items[i]).offset().top - $scrollBox.offset().top);
			var currLeft   = parseInt($(items[i]).offset().left + $scrollBox.scrollLeft());

			// get item's position in 'gant' view
			var gantTop    = lineIndex * linesHeight + 20;
			var gantWidth  = itemsWidth * widthFactors[i];
			var gantLeft   = linesEdges[lineIndex] + leftFactors[i] * itemsWidth;
			linesEdges[lineIndex] = gantLeft + gantWidth;

			// get item's transform value
			var topOffset  = gantTop - currTop;
			var leftOffset = gantLeft - currLeft;
			var transform  = 'translate3d(' + leftOffset + 'px,' + topOffset + 'px,0)';

			$(items[i]).find('.im-slider__item__body').css({
				transform: transform,
				width: gantWidth
			});
			
		}

		// change styles to gant mode
		$('#im-slider .im-slider__scene').height(gantSceneHeight);
		$('#im-slider').addClass('im-slider--gant-view');

		function _getSortedListOfItems() {

			// group by list
			var lists = [];
			var itemsCounter = 0;

			$('#im-slider .im-slider__list').each(function () {
				var items = $.makeArray($(this).find('.im-slider__item')).reverse();
				itemsCounter += items.length;
				lists.push(items);
			});

			// take from each list
			var items = [];
			var viewed = 0;
			while (viewed < itemsCounter) {
				lists.forEach(function (list) {
					if (list.length == 0) return;
					items.push(list.pop())
					viewed++;
				});
			};

			return items;
		}

		function _getShortestLineIndex() {
			var minLength = Infinity;
			var lineIndex = 0;

			linesEdges.forEach(function (value, index) {
				if (value < minLength) {
					minLength = value;
					lineIndex = index;
				}
			});

			return lineIndex;
		}

		function _getLongestLineIndex() {
			var maxLength = 0;
			var lineIndex = 0;

			linesEdges.forEach(function (value, index) {
				if (value > maxLength) {
					maxLength = value;
					lineIndex = index;
				}
			});

			return lineIndex;
		}

		function _isPositionInViewport(left) {
			return left - $scrollBox.scrollLeft() < $(window).width();
		}

	},

	_switchToLinesView: function () {
		var self = this;

		$('#im-slider .im-slider__scene').height('auto');
		$('#im-slider .im-slider__item__body').attr('style', '');
		$('#im-slider').removeClass('im-slider--gant-view');

	},

	_calcDimensions: function () {
		var self = this;

		self._state.maxListWidth = self._getMaxListWidth();
		self._state.maxScrollLeft = self._getMaxScrollLeft();
	},

	_getMaxListWidth: function () {
		var self = this;

		var maxWidth = 0;
		$('#im-slider .im-slider__list').each(function () {
			var $lastItem = $(this).find('.im-slider__item').last();
			var listOffset = $(this).offset().left;
			var itemOffset = $lastItem.offset().left;
			var itemWidth = $lastItem.width();
			var listWidth = itemOffset - listOffset + itemWidth;
			maxWidth = Math.max(maxWidth, listWidth);
		});
		return maxWidth;
	},

	_getMaxScrollLeft: function () {
		var $scrollBox = $('#im-slider .im-slider__scroll');
		var currScrollLeft = $scrollBox.scrollLeft();
		$scrollBox.scrollLeft(100000);
		var maxScrollLeft = $scrollBox.scrollLeft();
		$scrollBox.scrollLeft(currScrollLeft);
		return maxScrollLeft;
	},

	_setGridLinesWidth: function () {
		var self = this;

		$('#im-slider .im-slider__line').width(self._state.maxListWidth);
	},

	_initImagerJs: function () {
		new Imager('#im-slider .im-slider__bg__image img', { 
			availableWidths: [600, 1000], 
			availablePixelRatios: [1, 2],
			onImagesReplaced: function () {
				$(this.selector).each(function () {
					var src = $(this).attr('src');
					$(this).parent().css({ 'background-image': 'url(' + src + ')' });
				});
			}
		});
	},

	_initRangeSlider: function () {
		var self = this;

		var $range = $('#im-slider .im-slider__range');
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
				$('#im-slider .im-slider__scroll').scrollLeft(scrollLeft);
			}, 50)
		});

	},

	_startVideoLoading: function () {
		var self = this;

		$('#im-slider video').each(function () {
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

		self._calcDimensions();
		self._setGridLinesWidth();
	},

	_handleSliderScroll: function (e) {
		var self = e.data.self;

		var scrollLeft = $('#im-slider .im-slider__scroll').scrollLeft();
		var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
		$('#im-slider .im-slider__range input').val(rangeValue).change();
	},

	_handleToggleButton: function (e) {
		var self = e.data.self;

		if (self._state.currView == 'lines') {
			self._switchToGantView();
			self._state.currView = 'gant';
		} else {
			self._switchToLinesView();
			self._state.currView = 'lines';
		}
	},

	_bindUI: function () {
		var self = this;

		$('.im-slider__scroll').on('scroll', {self: self}, _.throttle(self._handleSliderScroll, 50));
		$('.im-slider__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(document).on('mouseover', '.im-slider__item', {self: self}, self._handleMouseOver);
		$(document).on('mouseout', '.im-slider__item', {self: self}, self._handleMouseOut);
		$(document).on('click', '.im-slider__toggle', {self: self}, self._handleToggleButton);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#im-slider').length == 0 ) return;

		self._calcDimensions();
		self._setGridLinesWidth();
		self._initRangeSlider();
		self._initImagerJs();
		self._bindUI();

		$('body').trigger('click');
	}

};