var $ = require('jquery');

module.exports = {

	_elems: {
		$_: $()
	},

	_handleButtonClick: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $currItem = $(this).closest('.nav-filter__item').toggleClass('_active');
		self._elems.$_.find('.nav-filter__item').not($currItem).removeClass('_active');
	},

	_handleDocumentClick: function (e) {
		var self = e.data.self;

		if ( $(e.target).closest('.nav-filter__button').length == 0 ){
			self._elems.$_.find('.nav-filter__item').removeClass('_active');
		}
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.nav-filter__button', {self: self}, self._handleButtonClick);
		$(document).on('click', {self: self}, self._handleDocumentClick);
	},

	init: function () {
		var self = this;

		var $_ = $('#nav-filter');

		if ($_.length == 0) return;

		self._elems.$_ = $_;

		self._bindUI();
	}
}