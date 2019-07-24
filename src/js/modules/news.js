
var News = {

	_elems: {
		$_: $(),
		$slider: $()
	},

	_handleNextButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		self._elems.$slider.trigger('next.owl.carousel');
	},

	_handlePrevButton: function (e) {
		var self = e.data.self;

		e.preventDefault();
		
		self._elems.$slider.trigger('prev.owl.carousel');
	},

	_handleChangedEvent: function (e) {
		var self = e.data.self;

		var activeClass = 'news__item--active';
		var nextIndex = e.item.index;

		self._elems.$slider.find('.news__item').removeClass(activeClass)
			.eq(nextIndex).addClass(activeClass);
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('click', '.js-news-next', {self: self}, self._handleNextButton);
		self._elems.$_.on('click', '.js-news-prev', {self: self}, self._handlePrevButton);
		self._elems.$_.on('changed.owl.carousel', {self: self}, self._handleChangedEvent);
	},

	init: function () {
		var self = this;

		var $_ = $('#news');

		if ( !$_.length ) return;

		self._elems.$_ = $_;
		self._elems.$slider = $_.find('.news__list');

		self._bindUI();

		self._elems.$slider.owlCarousel({
		    autoWidth: true,
		    touchDrag: false,
		    mouseDrag: false,
		    loop: true
		});	
	}
};