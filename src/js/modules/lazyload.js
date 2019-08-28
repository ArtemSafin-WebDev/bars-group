var $ = require('jquery');
require('jquery-lazy');

module.exports = {

	init: function () {

		$("#gantt-slider .bg-layer__image").Lazy({
			appendScroll: $('#gantt-slider .gantt-slider__scroll')[0]
		});

		$('.lazy').Lazy();
		
	}
}