var $ = require('jquery');
require('@fancyapps/fancybox');

module.exports = {

	_handleOpenButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var type = $(this).data('type') || 'inline';

		$.fancybox.open({
			src: $(this).data('src'),
			type: type,
			autoFocus: false,
			animationEffect: 'slide-in-out',
			modal: true
		});
	},

	_handleCloseButton: function (e) {
		var self = e.data.self;

		e.preventDefault();

		$.fancybox.close();
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.js-popup-close', {self: self}, self._handleCloseButton);
		$(document).on('click', '.js-popup-open', {self: self}, self._handleOpenButton);
	},

	init: function () {
		var self = this;

		self._bindUI();
	}
};