
var TechPromo = {



	_bindUI: function () {
		var self = this;

	},

	init: function () {
		var self = this;

		var $_ = $('#tech-promo');

		if ( $_.length == 0) return;

		$_.find('.tech-promo__orbit').addClass('--active');

		setTimeout(function () {
			$_.find('.tech-promo__point').addClass('--active');
		}, 2000);

		setTimeout(function () {
			$_.find('.tech-promo__center').addClass('--active');
		}, 3700);

		setTimeout(function () {
			$_.find('.tech-promo__circle').addClass('--active');
		}, 4500);

		self._bindUI();
	}
}

