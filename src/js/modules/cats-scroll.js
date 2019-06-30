var CatsScroll = {

	_state: {
		instances: []
	},

	_handleWindowResize: function (e) {
		var self = e.data.self;

		self._state.instances.forEach(function (ps) {
			ps.update();
		});
	},

	_bindUI: function () {
		var self = this;

		$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
	},

	init: function () {
		var self = this;

		$('.cats-scroll__list').each(function () {
			var ps = new PerfectScrollbar(this, {
                suppressScrollX: true
            });
            self._state.instances.push(ps);
        });

        self._bindUI();
	}
};


