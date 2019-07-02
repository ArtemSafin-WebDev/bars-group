
var Form = {

	_handleFocusOnInput: function (e) {
		var self = e.data.self;

		$(this).parent().addClass('_focused');
	},

	_handleBlurOnInput: function (e) {
		var self = e.data.self;

		if ( $(this).val() !== '' ) return;
		$(this).parent().removeClass('_focused');
	},

	_handleWingsMouseover: function (e) {
		var self = e.data.self;

		$(this).addClass('_hover');
	},

	_handleWingsMouseout: function (e) {
		var self = e.data.self;

		$(this).removeClass('_hover');
	},

	_bindUI: function () {
		var self = this;

		$(document).on('focus', '.js-form-input', {self: self}, self._handleFocusOnInput);
		$(document).on('blur', '.js-form-input', {self: self}, self._handleBlurOnInput);
		$(document).on('mouseover', '.js-form-wings', {self: self}, self._handleWingsMouseover);
		$(document).on('mouseout', '.js-form-wings', {self: self}, self._handleWingsMouseout);
	},

	init: function () {
		var self = this;

		self._bindUI();		
	}

};

