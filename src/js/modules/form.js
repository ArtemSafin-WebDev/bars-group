
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

