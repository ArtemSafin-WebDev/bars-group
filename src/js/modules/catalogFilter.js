
var CatalogFilter = {

	_elems: {
		$formFilter: $(),
		$navVideo: $()
	},

	_handleVideoMouseenter: function (e) {
		var self = e.data.self;

		if ($(this).hasClass('--active')) return;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].play();
	},

	_handleVideoMouseleave: function (e) {
		var self = e.data.self;

		if ($(this).hasClass('--active')) return;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].pause();
	},

	_handleVideoClick: function (e) {
		var self = e.data.self;

		$(this).toggleClass('--active').siblings().removeClass('--active');
	},

	_bindUI: function () {
		var self = this;

		self._elems.$navVideo.on('mouseenter', '.nav-video__item', {self: self}, self._handleVideoMouseenter);
		self._elems.$navVideo.on('mouseleave', '.nav-video__item', {self: self}, self._handleVideoMouseleave);
		self._elems.$navVideo.on('click', '.nav-video__item', {self: self}, self._handleVideoClick);
	},

	init: function () {
		var self = this;

		var $formFilter = $('#form-filter');
		var $navVideo = $('#nav-video');

		if ($navVideo.length == 0) return;

		self._elems.$formFilter = $formFilter;
		self._elems.$navVideo = $navVideo;

		self._bindUI();
	}
};
