
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

	_handleWindowResize: function (e) {
		var self = e.data.self;

		setTimeout(function () {
			self._elems.$slider.trigger('refresh.owl.carousel');
		}, 500);
	},

	_bindUI: function () {
		var self = this;

		self._elems.$_.on('click', '.js-news-next', {self: self}, self._handleNextButton);
		self._elems.$_.on('click', '.js-news-prev', {self: self}, self._handlePrevButton);
		self._elems.$_.on('changed.owl.carousel', {self: self}, self._handleChangedEvent);
		$(window).on('resize', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		var $_ = $('#news');

		if ( $_.length == 0 ) return;

		self._elems.$_ = $_;
		self._elems.$slider = $_.find('.news__list');

		self._bindUI();

		self._elems.$slider.owlCarousel({
		    loop: true,
		    autoWidth: true,
		    smartSpeed: 500
		});	
	}
};