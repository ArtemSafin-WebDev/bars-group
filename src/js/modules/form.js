var $ = require('jquery');
var autosize = require('autosize');
require('jquery.maskedinput');
require('jquery-validation');
require('jquery-form')($);
require('icheck');

$.extend( $.validator.messages, {
    required: "Вы пропустили поле",
    email: "Подправьте email"
});

var notify = require('./notify');

module.exports = {

	_resetForm: function ($form) {
		$form.data().validator.resetForm();
		$form
			.find('input, textarea').trigger('change')
			.filter('input').iCheck('update');
	},

	_handleFocusOnPhone: function (e) {
		var self = e.data.self;

		$(this).mask('+9 (999) 999-99-99', {
		    placeholder: " "
		});
	},

	_handleFocusOnInput: function (e) {
		var self = e.data.self;

		$(this).parent().addClass('_focus');
	},

	_handleBlurOnInput: function (e) {
		var self = e.data.self;

		$(this).parent().removeClass('_focus');
	},

	_handleFilledState: function (e) {
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

	_handleCheckedState: function (e) {
		var self = e.data.self;

		var isChecked = $(this).prop('checked');
		$(this).closest('.form__check').toggleClass('_active', isChecked);
	},

	_handleFormSubmit: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $form = $(this);
		var action = $form.data('action');

		$form.addClass('_loading');

		setTimeout(function () {

			$form.ajaxSubmit({
				url: action,
				dataType: 'json',
				success: function (data) {
					if ( data.status == 'success' ) {

						// notify success
						$form.addClass('_success');
						self._resetForm($form);

					} else {
					     // notify error
					    notify('Ошибка при отправке', 'Некорректный ответ от сервера');
					}
					$form.removeClass('_loading');
				},
				error: function (jqXHR, textStatus) {
					// notify error
					notify('Ошибка при отправке', textStatus);

					$form.removeClass('_loading');
				}
			});

		}, 500);

	},

	_handleSuccessClose: function (e) {
		var self = e.data.self;

		e.preventDefault();

		var $form = $(this).closest('form');
		
		if ($form.hasClass('popup')) {
			$.fancybox.close();
			setTimeout(function () {
				$form.removeClass('_success');
			}, 500);
		} else {
			$form.removeClass('_success');
		}

	},

	_handleICheckValidation: function (e) {
		var self = e.data.self;

		var validator = $(this).closest('form').data().validator;
		validator.element(this);
	},

	_bindUI: function () {
		var self = this;

		$(document).on('click', '.js-form-complete', {self: self}, self._handleSuccessClose);
		$(document).on('focus', '.js-form-input', {self: self}, self._handleFocusOnInput);
		$(document).on('blur', '.js-form-input', {self: self}, self._handleBlurOnInput);
		$(document).on('change', '.js-form-input', {self: self}, self._handleFilledState);
		$(document).on('focus', '.js-form-phone', {self: self}, self._handleFocusOnPhone);
		$(document).on('change', '.js-form-file', {self: self}, self._handleFileChange);
		$(document).on('ifCreated ifToggled', '.form__check input', {self: self}, self._handleCheckedState);
		$(document).on('ifToggled', '.js-form-validate input', {self: self}, self._handleICheckValidation);
		$(document).on('submit', '.js-form-validate', {self: self}, self._handleFormSubmit);
	},

	init: function () {
		var self = this;

		self._bindUI();

		// init autosize
		autosize($('textarea'));

		// init checkboxes
		$('input').iCheck();

		// init validate
		$('.js-form-validate').each(function () {
			$(this).validate({
				focusInvalid: false,
				errorClass: '_error',
				messages: {
				    agree: "Забыли про галочку",
				},
				errorPlacement: function($error, $element) {
					var $parent = $element.closest('.js-form-error-box');
					$error.appendTo($parent);
				},
				highlight: function(element, errorClass) {
					$(element).parent().addClass(errorClass);
				},
				unhighlight: function(element, errorClass) {
					$(element).parent().removeClass(errorClass);
				}
			});
		});

	}

};

