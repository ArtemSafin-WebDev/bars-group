module.exports = {

	isMobile: function () {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	},

	isTouchDevice: function () {
		return typeof window.ontouchstart !== 'undefined';
	},

	scrollTo: function (position) {
		$('html, body').stop().animate({ scrollTop: position});
	}

};
