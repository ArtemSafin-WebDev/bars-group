
var ImDigits = {

	_state: {
		currentIndex: 0,
		animating: false
	},

	_getNumsCount: function () {
		var self = this;

		return $('#im-digits .im-digits__nums__item').length;
	},

	_getDirection: function (nextIndex) {
		var self = this;

		var currentIndex = self._state.currentIndex;
		return (nextIndex > currentIndex) ? 'left' : 'right';
	},

	_slideToItem: function (index) {
		var self = this;

		if ( self._state.animating ) return;
		self._state.animating = true;

		// indexes
		var prevIndex = self._state.currentIndex;
		var nextIndex = index;

		// elements
		var $_ = $('#im-digits');
		var $numsCrop = $_.find('.im-digits__nums__crop');
		
		var $nextPicsItem = $_.find('.im-digits__pics__item').eq(nextIndex);
		var $nextNumsItem = $_.find('.im-digits__nums__item').eq(nextIndex);
		var $nextTextItem = $_.find('.im-digits__text__item').eq(nextIndex);
		var $nextTextValue = $nextTextItem.find('.im-digits__text__value');
		var $nextTextDesc = $nextTextItem.find('.im-digits__text__desc');

		var $currPicsItem = $_.find('.im-digits__pics__item').eq(prevIndex);
		var $currNumsItem = $_.find('.im-digits__nums__item').eq(prevIndex);
		var $currTextItem = $_.find('.im-digits__text__item').eq(prevIndex);
		var $currTextValue = $currTextItem.find('.im-digits__text__value');
		var $currTextDesc = $currTextItem.find('.im-digits__text__desc');

		// direction
		var direction = self._getDirection(index);

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
				}, 200);

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
				}, 200);

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
		}, 700);

	},

	_moveNumsToItem: function (index) {
		var self = this;

		// сложить ширину и отступ всех элементов до текущего 
		var $items = $('#im-digits .im-digits__nums__item');
		var maxIndex = Math.min(index, self._getNumsCount() - 1);
		var listOffset = 0;

		for (var i = 0; i <= maxIndex; i++) {
			listOffset += parseFloat($items.eq(i).width());
			listOffset += parseFloat($items.eq(i).css('margin-left'));
		}
		
		var $list = $('#im-digits .im-digits__nums__list');
		$list.css({'transform': 'translateX(-' + listOffset + 'px)'});
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

		if (nextIndex < 0) return;
		self._slideToItem(nextIndex);
	},

	_handleNextClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var nextIndex = self._state.currentIndex + 1;
		var lastIndex = self._getNumsCount() - 1;

		if (nextIndex > lastIndex) return;
		self._slideToItem(nextIndex);
	},

	_bindUI: function () {
		var self = this;


		$(document).on('click', '.im-digits__nums__item', {self: self}, self._handleNumClick);
		$(document).on('click', '.im-digits__prev', {self: self}, self._handlePrevClick);
		$(document).on('click', '.im-digits__next', {self: self}, self._handleNextClick);
	},

	init: function () {
		var self = this;

		if ( $('#im-digits').length == 0 ) return;

		self._moveNumsToItem(0);
		self._bindUI();
	}

};