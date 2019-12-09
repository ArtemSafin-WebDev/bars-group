var $ = require("jquery");

module.exports = {
    _handleTabClick: function(e) {
        e.preventDefault();

        var $_ = $(this).closest(".slider-tabs");

        var currIndex = $_.find(".slider-tabs__ctrl__item._active").index();
        var nextIndex = $(this).index();

        if (nextIndex == currIndex) return;

        // set active nav item
        var $navItems = $_.find(".slider-tabs__ctrl__item");
        $navItems.eq(currIndex).removeClass("_active");
        $navItems.eq(nextIndex).addClass("_active");

        // set active bg item
        var $bgItems = $_.find(".slider-tabs__pics__item");
        if (nextIndex > currIndex) {
            // slide down
            var nextStartPos = -80;
            var currEndPos = 0;
        } else {
            // slide up
            var nextStartPos = 0;
            var currEndPos = -80;
        }

        $bgItems
            .eq(nextIndex)
            .removeClass("_animate")
            .css({
                transform: "translateY(" + nextStartPos + "px)",
                opacity: 0
            });

        setTimeout(function() {
            $bgItems.eq(currIndex).css({
                transform: "translateY(" + currEndPos + "px)",
                opacity: 0
            });

            $bgItems
                .eq(nextIndex)
                .addClass("_animate")
                .css({
                    transform: "translateY(-40px)",
                    opacity: 1
                });
        }, 20);
    },

    _bindUI: function() {
        var self = this;

        $(document).on(
            "click",
            ".slider-tabs__ctrl__item",
            { self: self },
            self._handleTabClick
        );
    },

    init: function() {
        var self = this;

        self._bindUI();
    }
};
