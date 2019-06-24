
var Digits = {

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
		return $('#digits .digits__nums__item').length;
	},

	_getRealCount: function () {
		return $('#digits .digits__pics__item').length;
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
		$('#digits').addClass('_visible');
	},

	_setReadyState: function () {
		setTimeout(function () {
			$('#digits').addClass('_ready');
		}, 20);
	},

	_cloneNumsItems: function () {
		var self = this;

		var $_ = $('#digits');
		var $numsCrop = $_.find('.digits__nums__crop');
		var $numsList = $_.find('.digits__nums__list');
		var $numsItem = $_.find('.digits__nums__item');
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
		var $_ = $('#digits');
		var $numsCrop = $_.find('.digits__nums__crop');
		
		var $nextNumsItem = $_.find('.digits__nums__item').eq(nextIndex);
		var $nextPicsItem = $_.find('.digits__pics__item').eq(self._getRealIndex(nextIndex));
		var $nextTextItem = $_.find('.digits__text__item').eq(self._getRealIndex(nextIndex));
		var $nextTextValue = $nextTextItem.find('.digits__text__value');
		var $nextTextDesc = $nextTextItem.find('.digits__text__desc');

		var $currNumsItem = $_.find('.digits__nums__item').eq(currIndex);
		var $currPicsItem = $_.find('.digits__pics__item').eq(self._getRealIndex(currIndex));
		var $currTextItem = $_.find('.digits__text__item').eq(self._getRealIndex(currIndex));
		var $currTextValue = $currTextItem.find('.digits__text__value');
		var $currTextDesc = $currTextItem.find('.digits__text__desc');

		var $aboutItem = $_.find('.digits__about__item');

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
		var $items = $('#digits .digits__nums__item');
		var maxIndex = Math.min(index, self._getNumsCount() - 1);
		var listOffset = 0;

		for (var i = 0; i <= maxIndex; i++) {
			listOffset += parseFloat($items.eq(i).width());
			listOffset += parseFloat($items.eq(i).css('margin-left'));
		}
		
		var $list = $('#digits .digits__nums__list');
		$list.css({'transform': 'translateX(-' + listOffset + 'px)'});
	},

	_rebaseAtEdges: function () {
		var self = this;

		var $_ = $('#digits');
		var $numsCrop = $_.find('.digits__nums__crop');
		var $numsItem = $_.find('.digits__nums__item');
		var penultOffset = $numsItem .last().prev().offset().left;
		var rightEdge = $numsCrop.offset().left + $numsCrop.width();
		var currIndex = self._state.currentIndex;

		if (currIndex == 0 || penultOffset < rightEdge) {
			$('#digits').removeClass('_ready');

			if (currIndex == 0) {
				self._setInitialPosition();
			} else {
				self._setRightRebasePos();
			}
			setTimeout(function () {
				$('#digits').addClass('_ready');
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

		$(document).on('click', '.digits__nums__item', {self: self}, self._handleNumClick);
		$(document).on('click', '#digits .js-digits-prev', {self: self}, self._handlePrevClick);
		$(document).on('click', '#digits .js-digits-next', {self: self}, self._handleNextClick);
		$(document).on('touchstart', '.digits__center', {self: self}, self._handleTouchStart);
		$(document).on('touchmove', '.digits__center', {self: self}, self._handleTouchMove);
		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		if ( $('#digits').length == 0 ) return;

		self._cloneNumsItems();
		self._setInitialPosition();
		self._setVisibleState();
		self._setReadyState();

		self._bindUI();
	}

};