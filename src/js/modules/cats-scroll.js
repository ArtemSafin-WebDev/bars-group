var CatsScroll = {

	init: function () {
		var self = this;

		$('.cats-scroll__list').each(function () {
            new PerfectScrollbar(this, {
                suppressScrollX: true
            });
        });
        
	}
};


