var $ = require("jquery");
var TweenLite = require("TweenLite");
var DrawSVGPlugin = require("DrawSVGPlugin");
var NavBanner = require("./navBanner");
var Utils = require("./utils");

module.exports = {
    _elems: {
        $_: $()
    },

    _state: {
        timerId: null
    },

    _setActiveVideo: function(index) {
        var items = Array.prototype.slice.call(
            document.querySelectorAll("#tech-promo .bg-layer__item")
        );

        items.forEach(function(item, itemIndex) {

			console.log('Item', item);
            const video = item.querySelector("video");

            if (video) {
                if (itemIndex === index) {
                    video.play();
                    item.classList.add("_active");
                    video.classList.add("_active");
                } else {
					item.classList.remove("_active");
					video.classList.remove("_active");
					video.pause();
                }
            } else {
				console.log('No video');
			}
        });

        // var $items = $('#tech-promo .bg-layer__item');
        // $items.filter('._active').removeClass('_active').end().find('video')[0].pause();
        // $items.eq(index).addClass('_active').end().find('video')[0].play();
    },

    _handleCircleEnter: function(e) {
        var self = e.data.self;

        e.preventDefault();

        var index = $(this).data("index");

        clearTimeout(self._state.timerId);
        self._state.timerId = setTimeout(function() {
            self._setActiveVideo(index);
        }, 200);
    },

    _handleCircleLeave: function(e) {
        var self = e.data.self;

        e.preventDefault();

        clearTimeout(self._state.timerId);
        self._state.timerId = setTimeout(function() {
            self._setActiveVideo(0);
        }, 200);
    },

    _handleCircleClick: function(e) {
        var $target = $("#" + $(this).data("target"));
        var tabIndex = $target.parent().index();
        NavBanner.showTabByIndex(tabIndex);

        var SPACE_BEFORE = 200;
        var scrollPos = $target.offset().top - SPACE_BEFORE;
        Utils.scrollTo(scrollPos);
    },

    _bindUI: function() {
        var self = this;

        $("#tech-promo .tech-promo__circle").on(
            "mouseenter",
            { self: self },
            self._handleCircleEnter
        );
        $("#tech-promo .tech-promo__circle").on(
            "mouseleave",
            { self: self },
            self._handleCircleLeave
        );
        self._elems.$_.on(
            "click",
            ".tech-promo__circle",
            { self: self },
            self._handleCircleClick
        );
    },

    init: function() {
        var self = this;

		var $_ = $("#tech-promo");
		


		if ($_.length == 0) return;
		

		self._setActiveVideo(0);

        self._elems.$_ = $_;

        console.log("Initializing tech circles");
        TweenLite.fromTo(
            $_.find(".tech-promo__orbit circle")[0],
            2,
            { drawSVG: "0%" },
            { drawSVG: "100%" }
        );

        setTimeout(function() {
            $_.find(".tech-promo__point").addClass("_active");
        }, 2000);

        setTimeout(function() {
            $_.find(".tech-promo__center").addClass("_active");
        }, 2800);

        var $circles = $_.find(".tech-promo__circle");

        setTimeout(function() {
            $circles.addClass("_active");
        }, 3200);

        setTimeout(function() {
            $circles.removeClass("_delay-1 _delay-2 _delay-3");
        }, 3800);

        self._bindUI();
    }
};
