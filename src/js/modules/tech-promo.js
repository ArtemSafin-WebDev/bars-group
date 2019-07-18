
var TechPromo = {

	_bindUI: function () {
		var self = this;

	},

	init: function () {
		var self = this;

		var $_ = $('#tech-promo');

		if ( $_.length == 0) return;

		$_.find('.tech-promo__elem-1').addClass('--active');

		setTimeout(function () {
			$_.find('.tech-promo__point').addClass('--active');
		}, 2000);

		setTimeout(function () {
			$_.find('.tech-promo__data').addClass('--active');
		}, 4000);
	}
}

