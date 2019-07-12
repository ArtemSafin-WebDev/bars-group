/*!
 * THIS FILE IS GENERATED BY GULP PROJECT. 
 * NEVER CHANGE IT MANUALLY, OTHERWISE YOUR CHANGES 
 * CAN BE OVERWRITTEN. 
 * 
 * @description 
 * @repository git@bitbucket.org:ildar-meyker/html-barsgroup.git
 */

(function () {

	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

	if (!iOS) return;

	function appendStyle(styles) {
	  var css = document.createElement('style');
	  css.type = 'text/css';

	  if (css.styleSheet) css.styleSheet.cssText = styles;
	  else css.appendChild(document.createTextNode(styles));

	  document.getElementsByTagName("head")[0].appendChild(css);
	}

	var styles = '* {cursor: pointer; }';

	window.onload = function() { appendStyle(styles) };

})();


var Overview = {

	_state: {
		isUserActivityHandled: false,
		currIndex: 0
	},

	_startVideoLoading: function () {
		var self = this;

		$('#overview video').each(function () {
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
		$(this)[0].play()
	},

	_handleLinkClick: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		var nextIndex = $(this).closest('.overview__nav__item').index();
		var currIndex = self._state.currIndex;

		if (nextIndex == currIndex) return;

		var $_ = $('#overview');

		// set active nav item
		var $navItems = $_.find('.overview__nav__item');
		$navItems.eq(currIndex).removeClass('_active');
		$navItems.eq(nextIndex).addClass('_active');

		// set active about item
		var $aboutItems = $_.find('.overview__about__item');
		$aboutItems.eq(currIndex).removeClass('_active');
		$aboutItems.eq(nextIndex).addClass('_active');

		// collapse bodies
		var $navBodies = $_.find('.overview__nav__body');
		$navBodies.eq(currIndex).collapse('hide');
		$navBodies.eq(nextIndex).collapse('show');

		// set active bg item
		var $bgItems = $_.find('.overview__bg__item');
		if (nextIndex > currIndex) {
			// slide down
			var nextStartPos = -80;
			var currEndPos = 0;
		} else {
			// slide up
			var nextStartPos = 0;
			var currEndPos = -80;
		}

		$bgItems.eq(nextIndex).removeClass('_animate').css({
			transform: 'translateY(' + nextStartPos + 'px)',
			opacity: 0
		});

		setTimeout(function () {

			$bgItems.eq(currIndex).css({
				transform: 'translateY(' + currEndPos + 'px)',
				opacity: 0
			});

			$bgItems.eq(nextIndex).addClass('_animate').css({
				transform: 'translateY(-40px)',
				opacity: 1
			});

		}, 20);

		

		self._state.currIndex = nextIndex;
		
	},

	_bindUI: function () {
		var self = this;

		$('.overview__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
		$(document).one('click touchstart', {self: self}, self._handleUserActivity);
		$(document).on('click', '.overview__nav__link', {self: self}, self._handleLinkClick);
	},

	init: function () {
		var self = this;

		if ( $('#overview').length == 0 ) return;

		self._bindUI();

		$('body').trigger('click');
	}

};

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

var SliderContent = {

	_updateSliderWidth: function () {
		var self = this;

		var $_ = $('#slider-content');
		var $slider = $_.find('.slider-content__list');

		var MIN_WINDOW_WIDTH = 1300;
		var MAX_WING_WIDTH = 200;

		var windowWidth = $(window).width();
		var sectionWidth = $_.width()
		var sectionEnd = $_.offset().left + sectionWidth;
		var wingWidth = windowWidth - sectionEnd;

		if (wingWidth > MAX_WING_WIDTH || windowWidth < MIN_WINDOW_WIDTH) {
			$slider.css({ 'margin-right': 0 });
			$_.removeClass('--has-wing');
		} else {
			$slider.css({ 'margin-right': -wingWidth });
			$_.addClass('--has-wing');
		}

		$slider.slick('refresh');
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._updateSliderWidth();
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},	

	init: function () {
		var self = this;

		if ( $('#slider-content').length == 0 ) return;
		if ( $('body').hasClass('is-admin') ) return;

		var $_ = $('#slider-content');

		$_.find('.slider-content__list').slick({
			dots: false,
			infinite: false,
			prevArrow: $_.find('.js-slider-content-prev'),
			nextArrow: $_.find('.js-slider-content-next'),
			fade: true
		});

		self._updateSliderWidth();
		self._bindUI();
	}

};

var SliderDigits = {

	_state: {
		currentIndex: null,
		touchStartX: null,
		touchStartY: null,
		animating: false
	},

	_getRealIndex: function (index) {
		var self = this;

		return index % self._getRealCount(); 
	},

	_getNumsCount: function () {
		return $('#slider-digits .slider-digits__nums__item').length;
	},

	_getRealCount: function () {
		return $('#slider-digits .slider-digits__pics__item').length;
	},

	_getDirection: function (nextIndex) {
		var self = this;

		var currentIndex = self._state.currentIndex;
		return (nextIndex > currentIndex) ? 'left' : 'right';
	},

	_setInitialPosition: function () {
		var self = this;

		var count = self._getRealCount();

		self._state.currentIndex = count;
		self._moveNumsToItem(count);
	},

	_setRightRebasePos: function () {
		var self = this;

		var count = self._getRealCount();
		var nextIndex = self._state.currentIndex - count;

		self._state.currentIndex = nextIndex;
		self._moveNumsToItem(nextIndex);
	},

	_setVisibleState: function () {
		$('#slider-digits').addClass('_visible');
	},

	_setReadyState: function () {
		setTimeout(function () {
			$('#slider-digits').addClass('_ready');
		}, 20);
	},

	_cloneNumsItems: function () {
		var self = this;

		var $_ = $('#slider-digits');
		var $numsCrop = $_.find('.slider-digits__nums__crop');
		var $numsList = $_.find('.slider-digits__nums__list');
		var $numsItem = $_.find('.slider-digits__nums__item');
		var cropWidth = $numsCrop.width();
		var listWidth = $numsList.width();
		var factor = Math.ceil(cropWidth / listWidth) + 1;

		for (var i = 0; i < factor; i++) {
			$numsItem.clone().appendTo($numsList);
		}
	},

	_slideToItem: function (index) {
		var self = this;

		if ( self._state.animating ) return;
		self._state.animating = true;

		// indexes
		var currIndex = self._state.currentIndex;
		var nextIndex = index;

		// elements
		var $_ = $('#slider-digits');
		var $numsCrop = $_.find('.slider-digits__nums__crop');
		
		var $nextNumsItem = $_.find('.slider-digits__nums__item').eq(nextIndex);
		var $nextPicsItem = $_.find('.slider-digits__pics__item').eq(self._getRealIndex(nextIndex));
		var $nextTextItem = $_.find('.slider-digits__text__item').eq(self._getRealIndex(nextIndex));
		var $nextTextValue = $nextTextItem.find('.slider-digits__text__value');
		var $nextTextDesc = $nextTextItem.find('.slider-digits__text__desc');

		var $currNumsItem = $_.find('.slider-digits__nums__item').eq(currIndex);
		var $currPicsItem = $_.find('.slider-digits__pics__item').eq(self._getRealIndex(currIndex));
		var $currTextItem = $_.find('.slider-digits__text__item').eq(self._getRealIndex(currIndex));
		var $currTextValue = $currTextItem.find('.slider-digits__text__value');
		var $currTextDesc = $currTextItem.find('.slider-digits__text__desc');

		var $aboutItem = $_.find('.slider-digits__about__item');

		// direction
		var direction = self._getDirection(index);

		$aboutItem.eq(self._getRealIndex(currIndex)).removeClass('_active');
		
		setTimeout(function () {
			$aboutItem.eq(self._getRealIndex(nextIndex)).addClass('_active');
		}, 0);

		switch (direction) {
			case 'left': 

				// create fake copy of next num item
				var $fakeNumsItem = $nextNumsItem.clone();
				var position = $nextNumsItem.offset().left - $numsCrop.offset().left;
				$fakeNumsItem.addClass('_fixed').css({'left': position}).appendTo($numsCrop);
				$nextNumsItem.addClass('_hidden');

				// get the distance we will animate
				var distance = $fakeNumsItem.offset().left - $nextTextValue.offset().left;
				
				// set next text value to start position
				$nextTextValue.css({'transform': 'translateX(' + distance + 'px)'});

				// hide things
				$currTextDesc.addClass('_fadeOutLeft');
				$currTextValue.addClass('_fadeOutLeft');

				// show things
				setTimeout(function () {
					$nextPicsItem.addClass('_active _cover _fadeInImage');
					$nextTextDesc.addClass('_fadeInRight');
					$nextTextValue.addClass('_ready').css({'transform': 'translateX(0)'});
					$nextTextItem.addClass('_active');
					$fakeNumsItem.css({'transform': 'translateX(-' + distance + 'px)'});
					self._moveNumsToItem(nextIndex);
				}, 0);

			break;
			case 'right':

				// create fake copy of next num item
				var $fakeNumsItem = $currNumsItem.clone();
				var position = $currTextValue.offset().left - $numsCrop.offset().left;
				$fakeNumsItem.addClass('_fixed').css({'left': position}).appendTo($numsCrop);
				$currNumsItem.addClass('_hidden');

				// get the distance we will animate
				var distance = $numsCrop.offset().left - $currTextValue.offset().left + 
					parseFloat($currNumsItem.css('margin-left'));

				// hide things
				$currTextDesc.addClass('_fadeOutRight');
				$currTextValue.addClass('_ready').css({'transform': 'translateX(' + distance + 'px)'});
				$fakeNumsItem.css({'transform': 'translateX(' + distance + 'px)'});
				self._moveNumsToItem(nextIndex);

				// show things
				setTimeout(function () {
					$nextPicsItem.addClass('_active _cover _fadeInImage');
					$nextTextDesc.addClass('_fadeInLeft');
					$nextTextValue.addClass('_fadeInLeft');
					$nextTextItem.addClass('_active');
				}, 0);

			break;
		}

		setTimeout(function () {

			// clear transition classes
			$currPicsItem.removeClass('_active');
			$currTextItem.removeClass('_active');
			$currTextDesc.removeClass('_fadeOutLeft _fadeOutRight');
			$currTextValue.removeClass('_ready _fadeOutLeft').attr('style', '');
			$currNumsItem.removeClass('_hidden');

			$nextPicsItem.removeClass('_cover _fadeInImage');
			$nextTextDesc.removeClass('_fadeInRight _fadeInLeft');
			$nextTextValue.removeClass('_ready _fadeInLeft').attr('style', '');
			$nextNumsItem.removeClass('_hidden');
			
			$fakeNumsItem.remove();

			// allow animating
			self._state.animating = false;
			self._state.currentIndex = nextIndex;

			// rebase, if no side clones
			self._rebaseAtEdges();
		}, 700);

	},

	_moveNumsToItem: function (index) {
		var self = this;

		// сложить ширину и отступ всех элементов до текущего 
		var $items = $('#slider-digits .slider-digits__nums__item');
		var maxIndex = Math.min(index, self._getNumsCount() - 1);
		var listOffset = 0;

		for (var i = 0; i <= maxIndex; i++) {
			listOffset += parseFloat($items.eq(i).width());
			listOffset += parseFloat($items.eq(i).css('margin-left'));
		}
		
		var $list = $('#slider-digits .slider-digits__nums__list');
		$list.css({'transform': 'translateX(-' + listOffset + 'px)'});
	},

	_rebaseAtEdges: function () {
		var self = this;

		var $_ = $('#slider-digits');
		var $numsCrop = $_.find('.slider-digits__nums__crop');
		var $numsItem = $_.find('.slider-digits__nums__item');
		var penultOffset = $numsItem .last().prev().offset().left;
		var rightEdge = $numsCrop.offset().left + $numsCrop.width();
		var currIndex = self._state.currentIndex;

		if (currIndex == 0 || penultOffset < rightEdge) {
			$('#slider-digits').removeClass('_ready');

			if (currIndex == 0) {
				self._setInitialPosition();
			} else {
				self._setRightRebasePos();
			}
			setTimeout(function () {
				$('#slider-digits').addClass('_ready');
			}, 20);
		} 
	},

	_handleNumClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var nextIndex = $(this).index();
		self._slideToItem(nextIndex);
	},

	_handlePrevClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var nextIndex = self._state.currentIndex - 1;
		self._slideToItem(nextIndex);
	},

	_handleNextClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var nextIndex = self._state.currentIndex + 1;
		self._slideToItem(nextIndex);
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		var currIndex = self._state.currentIndex;
		self._moveNumsToItem(currIndex);
	},

	_handleTouchStart: function (e) {
		var self = e.data.self;

		self._state.touchStartX = e.originalEvent.touches[0].clientX;
		self._state.touchStartY = e.originalEvent.touches[0].clientX;
	},

	_handleTouchMove: function (e) {
		var self = e.data.self;

		var touchStartX = self._state.touchStartX;
		var touchStartY = self._state.touchStartY;

		var deltaX = touchStartX - e.originalEvent.touches[0].clientX;
		var deltaY = touchStartY - e.originalEvent.touches[0].clientY;
		
		if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY)) {
			if (deltaX > 0) {
				// swipe left
				var nextIndex = self._state.currentIndex + 1;
			} else {
				// swipe right
				var nextIndex = self._state.currentIndex - 1;
			}
			self._slideToItem(nextIndex);
		}
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.slider-digits__nums__item', {self: self}, self._handleNumClick);
		$(document).on('click', '#slider-digits .js-slider-digits-prev', {self: self}, self._handlePrevClick);
		$(document).on('click', '#slider-digits .js-slider-digits-next', {self: self}, self._handleNextClick);
		$(document).on('touchstart', '.slider-digits__center', {self: self}, self._handleTouchStart);
		$(document).on('touchmove', '.slider-digits__center', {self: self}, self._handleTouchMove);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#slider-digits').length == 0 ) return;

		self._cloneNumsItems();
		self._setInitialPosition();
		self._setVisibleState();
		self._setReadyState();

		self._bindUI();
	}

};


var SliderTabs = {

	_handleTabClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $_ = $(this).closest('.slider-tabs');
		
		var currIndex = $_.find('.slider-tabs__ctrl__item._active').index();
		var nextIndex = $(this).index();

		if (nextIndex == currIndex) return;

		// set active nav item
		var $navItems = $_.find('.slider-tabs__ctrl__item');
		$navItems.eq(currIndex).removeClass('_active');
		$navItems.eq(nextIndex).addClass('_active');

		// set active bg item
		var $bgItems = $_.find('.slider-tabs__pics__item');
		if (nextIndex > currIndex) {
			// slide down
			var nextStartPos = -80;
			var currEndPos = 0;
		} else {
			// slide up
			var nextStartPos = 0;
			var currEndPos = -80;
		}

		$bgItems.eq(nextIndex).removeClass('_animate').css({
			transform: 'translateY(' + nextStartPos + 'px)',
			opacity: 0
		});

		setTimeout(function () {

			$bgItems.eq(currIndex).css({
				transform: 'translateY(' + currEndPos + 'px)',
				opacity: 0
			});

			$bgItems.eq(nextIndex).addClass('_animate').css({
				transform: 'translateY(-40px)',
				opacity: 1
			});

		}, 20);

	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.slider-tabs__ctrl__item', {self: self}, self._handleTabClick);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}

};

var Header = {


	_adjustMoreItem: function () {
		var self = this;

		var $_ = $('#header');

		// close dropdown during resizing
		var $more = $_.find('.header__menu__item--more');
		$more.removeClass('--opened');

		// compare container & items top offsets and find break point
		var $crop  = $_.find('.header__menu__crop');
		var cropOffset = $crop.offset().top;
		var $items = $crop.find('.header__menu__item');
		var lastIndex = 0;

		$items.each(function (index) {
			var itemOffset = $(this).offset().top;
			if (itemOffset == cropOffset) {
				lastIndex = index;
			}
		});

		// show 'more', if lastIndex less than maxIndex
		var $lastItem = $items.eq(lastIndex);
		var maxIndex = $items.length - 1;

		if (lastIndex < maxIndex) {

			// show 'more' and position it
			var lastItemLeft = $lastItem.offset().left - $crop.offset().left;
			var lastItemMargin = parseInt($lastItem.css('margin-right'));
			var lastItemWidth = $lastItem.width();

			var moreOffset = lastItemLeft + lastItemMargin + lastItemWidth;
			$more.addClass('--shown').css({ left: moreOffset + 'px'});

			// show/hide 'more' elements
			var $moreItems = $_.find('.header__menu__down__body > div');
			$moreItems.each(function (index) {
				if (index > lastIndex) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});

		} else {
			$more.removeClass('--shown');
		}

	},

	_handleMoreClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		$('#header .header__menu__item--more').toggleClass('--opened');
	},

	_handleDocumentClick: function (e) {
		var self = e.data.self;

		var moreSelector = '.header__menu__item--more';
		if ( $(e.target).closest(moreSelector).length == 0 ){
			$('#header ' + moreSelector).removeClass('--opened');
		}
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._adjustMoreItem();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', {self: self}, self._handleDocumentClick);
		$(document).on('click', '.header__menu__item--more > a', {self: self}, self._handleMoreClick);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#header').length == 0) return;

		self._adjustMoreItem();
		self._bindUI();
	}
}

var News = {

	_state: {
		owl: null
	},

	_setSliderWidth: function () {
		var self = this;

		var $wrapper = $('#wrapper');
		var $slider  = $('#news .news__slider');
		var wrapperOffset = $wrapper.offset().left;
		var wrapperWidth = $wrapper.width();
		var sliderOffset = $slider.offset().left;
		var sliderWidth = wrapperWidth- (sliderOffset - wrapperOffset);
		$slider.width(sliderWidth);
	},

	_initSlider: function () {
		var self = this;

		self._state.owl = $('#news .news__list').owlCarousel({
		    loop: true,
		    autoWidth: true,
		    touchDrag: false,
		    mouseDrag: false,
		    smartSpeed: 500
		});	

	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._state.owl.trigger('next.owl.carousel');

		$('#news .news__item.--active')
			.removeClass('--active')
			.parent().next().find('.news__item')
			.addClass('--active');
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		self._state.owl.trigger('prev.owl.carousel');

		$('#news .news__item.--active')
			.removeClass('--active')
			.parent().prev().find('.news__item')
			.addClass('--active');

	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._setSliderWidth();
		self._state.owl.trigger('refresh.owl.carousel');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '#news .js-news-next', {self: self}, self._handleNextButton);
		$(document).on('click', '#news .js-news-prev', {self: self}, self._handlePrevButton);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#news').length == 0 ) return;

		self._setSliderWidth();
		self._initSlider();
		self._bindUI();
	}
};

var Form = {

	_handleFocusOnInput: function (e) {
		var self = e.data.self;

		$(this).parent().addClass('_focused');
	},

	_handleBlurOnInput: function (e) {
		var self = e.data.self;

		$(this).parent().removeClass('_focused');
	},

	_handleInputChange: function (e) {
		var self = e.data.self;

		$(this).parent().toggleClass('_filled', !!$(this).val().length);
	},

	_handleWingsMouseover: function (e) {
		var self = e.data.self;

		$(this).addClass('_hover');
	},

	_handleWingsMouseout: function (e) {
		var self = e.data.self;

		$(this).removeClass('_hover');
	},

	_handleFileChange: function (e) {
		var self = e.data.self;

		var files = $(this).find('input[type="file"]')[0].files;
		var names = $.map(files, function (file) {
			return file.name;
		});

		if ( names.length == 0 ) {
			$(this)
				.removeClass('_chosen');
		} else {
			$(this)
				.addClass('_chosen')
				.find('.js-form-file__names')
				.html(names.join(', '));
		}

	},

	_bindUI: function () {
		var self = this;

		$(document).on('focus', '.js-form-input', {self: self}, self._handleFocusOnInput);
		$(document).on('blur', '.js-form-input', {self: self}, self._handleBlurOnInput);
		$(document).on('change', '.js-form-input', {self: self}, self._handleInputChange);
		$(document).on('mouseover', '.js-form-wings', {self: self}, self._handleWingsMouseover);
		$(document).on('mouseout', '.js-form-wings', {self: self}, self._handleWingsMouseout);
		$(document).on('change', '.js-form-file', {self: self}, self._handleFileChange);
	},

	init: function () {
		var self = this;

		// init autosize
		autosize($('textarea'));

		// init checkboxes
		$('input').iCheck();

		self._bindUI();		
	}

};

(function () {

	function manipulation() {
		var
			windowWidth = $(window).innerWidth(),
			containerWidth = $('.page__center').width(),
			containerPadding = $('.page__inner').innerWidth() - $('.page__inner').width(),
			offset = (windowWidth - containerWidth) / 2 + containerPadding / 2;

		$('.jsOffsetRight').css('margin-right', -offset + 'px');
	}

	$(window).on('load', function() {
		setTimeout(function() {
			manipulation();
		}, 700);
	});

	$(window).on('load, resize', function() {
		manipulation();
	});

	$(document).ready(function() {
		if ($('.jsTTasksSlider').length) {
			$('.jsTTasksSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tTasks__nav'
			});
		}

		if ($('.jsTIntroducedSlider').length) {
			$('.jsTIntroducedSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tIntroduced__nav'
			});
		}

		if ($('.jsTComponentsSlider').length) {
			$('.jsTComponentsSlider').owlCarousel({
				items: 1,
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				navContainer: '.tComponents__nav'
			});
		}

		if ($('.jsTNewsSlider').length) {
			$('.jsTNewsSlider').owlCarousel({
				dots: false,
				nav: true,
				loop: true,
				navText: [''],
				margin: 30,
				responsive: {
					0: {
						items: 1.5
					},
					800: {
						items: 2.5
					},
					1366: {
						items: 3.5
					}
				}
			});
		}
	});

})();

var ScrollableTable = {
    
    init: function() {
        var self = this;

        var initialOverflow = false;

        var scrollableTables = Array.prototype.slice.call(
            document.querySelectorAll(".js-srollable-table")
        );

        scrollableTables.forEach(function(item) {
            var scrollableContainer = item.querySelector(
                ".js-scroll-container"
            );
            var gradientWrapper = item;

            var handleGradientsOnStart = function() {
                if (
                    scrollableContainer.scrollWidth >
                    scrollableContainer.offsetWidth
                ) {
                    initialOverflow = true;
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--right-gradient"
                    );
                } else {
                    initialOverflow = false;
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--right-gradient"
                    );
                }
            };

            var handleGradientsOnScroll = function() {
                var scrollLeft = this.scrollLeft;
                var scrollWidth = this.scrollWidth;
                var offsetWidth = this.offsetWidth;

                if (scrollLeft > 0 && scrollLeft < scrollWidth - offsetWidth) {
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--right-gradient"
                    );
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--left-gradient"
                    );
                } else if (scrollLeft === 0) {
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--left-gradient"
                    );
                } else if (
                    scrollLeft > 0 &&
                    scrollLeft === scrollWidth - offsetWidth
                ) {
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--right-gradient"
                    );
                }
            };

            if (scrollableContainer) {
                new PerfectScrollbar(scrollableContainer, {
                    maxScrollbarLength: 105
                });

                handleGradientsOnStart();

                if (initialOverflow) {
                    scrollableContainer.addEventListener(
                        "scroll",
                        handleGradientsOnScroll
                    );
                }

                window.addEventListener("resize", function() {
                    scrollableContainer.removeEventListener(
                        "scroll",
                        handleGradientsOnScroll
                    );
                    handleGradientsOnStart();
                    if (initialOverflow) {
                        scrollableContainer.addEventListener(
                            "scroll",
                            handleGradientsOnScroll
                        );
                    }
                });
            }
        });
    }
};
var NewsSlider = {
    init: function() {
        var newsSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliders.forEach(function(item) {
            new Swiper(item, {
                slidesPerView: "auto",
                spaceBetween: 25,
                navigation: {
                    nextEl: document.querySelector(".js-news-slider--next"),
                    prevEl: document.querySelector(".js-news-slider--prev")
                }
            });
        });
    }
};
var NewsPhotoSlider = {
    init: function() {
        var photoSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-details-photo-slider")
        );

        photoSliders.forEach(function(item) {
            var thumbnails = item.querySelector(
                ".js-news-details-thumbnails-slider"
            );
            var container = item.querySelector(".swiper-container");

            var thumbContainer;
            var thumbSlider;

            if (thumbnails) {
                thumbContainer = thumbnails.querySelector(".swiper-container");
            }

            if (thumbContainer) {
                thumbSlider = new Swiper(thumbContainer, {
                    slidesPerView: "auto",
                    spaceBetween: 15,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                    slideToClickedSlide: true,
                    on: {
                        reachEnd: function() {
                            thumbnails.classList.remove("gradient-shown");
                        }
                    }
                });
            }

            if (container) {
                new Swiper(container, {
                    effect: "fade",
                    speed: 600,
                    fadeEffect: { crossFade: true },
                    navigation: {
                        nextEl: document.querySelector(
                            ".news-details__photo-slider-next"
                        ),
                        prevEl: document.querySelector(
                            ".news-details__photo-slider-prev"
                        )
                    },
                    thumbs: {
                        swiper: thumbSlider
                    }
                });
            }
        });
    }
};
var App = {

	_initImagerJs: function () {
		new Imager('.js-imager-box img', { 
			availableWidths: [1000, 1500], 
			availablePixelRatios: [1],
			onImagesReplaced: function () {
				$(this.selector).each(function () {
					var src = $(this).attr('src');
					$(this).parent().addClass('--inited').css({ 'background-image': 'url(' + src + ')' });
				});
			}
		});
	},
	
	_handleDOMReady: function () {
		var self = this;

		// init modules here
		self._initImagerJs();
		Overview.init();
		SliderContent.init();
		SliderDigits.init();
		SliderTabs.init();
		GanttSlider.init();
		Header.init();
		News.init();
		Form.init();
		ScrollableTable.init();
		NewsSlider.init();
		NewsPhotoSlider.init();
	},

	_bindUI: function () {
		var self = this;

		$(document).ready(self._handleDOMReady.bind(self));
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};

App.init();