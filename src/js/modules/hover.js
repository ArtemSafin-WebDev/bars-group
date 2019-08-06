
var Hover = {

	_handleWingsMouseenter: function (e) {
		var self = e.data.self;

		$(this).addClass('--hover');
	},

	_handleWingsMouseleave: function (e) {
		var self = e.data.self;

		$(this).removeClass('--hover');
	},

	_handleVideoMouseenter: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].play();
	},

	_handleVideoMouseleave: function (e) {
		var self = e.data.self;

		var $video = $(this).find('video.--active');
		if ($video.length) $video[0].pause();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('mouseenter', '.js-hover-video', {self: self}, self._handleVideoMouseenter);
		$(document).on('mouseleave', '.js-hover-video', {self: self}, self._handleVideoMouseleave);
		$(document).on('mouseenter', '.js-hover-wings', {self: self}, self._handleWingsMouseenter);
		$(document).on('mouseleave', '.js-hover-wings', {self: self}, self._handleWingsMouseleave);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
}