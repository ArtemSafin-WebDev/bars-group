
var ScrollableTable = {
    
    init: function() {
        var self = this;

        var initialOverflow = false;

        var scrollableTables = Array.prototype.slice.call(
            document.querySelectorAll(".js-srollable-table")
        );

        scrollableTables.forEach(function(item) {
            var scrollableContainer = item.querySelector(
                ".js-scroll-container"
            );
            var gradientWrapper = item;

            var handleGradientsOnStart = function() {
                if (
                    scrollableContainer.scrollWidth >
                    scrollableContainer.offsetWidth
                ) {
                    initialOverflow = true;
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--right-gradient"
                    );
                } else {
                    initialOverflow = false;
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--right-gradient"
                    );
                }
            };

            var handleGradientsOnScroll = function() {
                var scrollLeft = this.scrollLeft;
                var scrollWidth = this.scrollWidth;
                var offsetWidth = this.offsetWidth;

                if (scrollLeft > 0 && scrollLeft < scrollWidth - offsetWidth) {
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--right-gradient"
                    );
                    gradientWrapper.classList.add(
                        "table-gradient-wrapper--left-gradient"
                    );
                } else if (scrollLeft === 0) {
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--left-gradient"
                    );
                } else if (
                    scrollLeft > 0 &&
                    scrollLeft === scrollWidth - offsetWidth
                ) {
                    gradientWrapper.classList.remove(
                        "table-gradient-wrapper--right-gradient"
                    );
                }
            };

            if (scrollableContainer) {
                new PerfectScrollbar(scrollableContainer, {
                    maxScrollbarLength: 105
                });

                handleGradientsOnStart();

                if (initialOverflow) {
                    scrollableContainer.addEventListener(
                        "scroll",
                        handleGradientsOnScroll
                    );
                }

                window.addEventListener("resize", function() {
                    scrollableContainer.removeEventListener(
                        "scroll",
                        handleGradientsOnScroll
                    );
                    handleGradientsOnStart();
                    if (initialOverflow) {
                        scrollableContainer.addEventListener(
                            "scroll",
                            handleGradientsOnScroll
                        );
                    }
                });
            }
        });
    }
};
