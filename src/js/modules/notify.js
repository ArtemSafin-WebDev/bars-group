var $ = require('jquery');
require('notifyjs')($);

$.notify.addStyle("global", {
    html:
        "<div>" +
            "<div class='notifyjs-global-wrapper'>" +
                "<div class='notifyjs-global-title' data-notify-html='title'/>" +
                "<div class='notifyjs-global-text' data-notify-html='text'/>" +
            "</div>" +
        "</div>"
});

module.exports = function (title, text) {
	$.notify({
		title: title,
		text: text
	}, {
		style: 'global',
		position: 'top left'
	});
}