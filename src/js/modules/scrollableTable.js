var PerfectScrollbar = require('perfect-scrollbar');

module.exports = {
    
    init: function() {
        
        var initialOverflow = false;

        var scrollableTables = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-details-content table")
        );

        function wrapTable(table) {
            
            var tableBlock = document.createElement("div");
            tableBlock.className = 'table-block';
            var tableGradientWrapper = document.createElement("div");
            tableGradientWrapper.className = 'table-gradient-wrapper js-srollable-table';
            var tableScrollContainer = document.createElement("div");
            tableScrollContainer.className = 'table-scroll-container js-scroll-container';
            var tablePreviousSibling = table.previousElementSibling;
            var tablePreviousSiblingType;
            
            table.parentNode.insertBefore(tableBlock, table);

            tableBlock.appendChild(tableGradientWrapper)
            tableGradientWrapper.appendChild(tableScrollContainer);
            tableScrollContainer.appendChild(table)

            if (tablePreviousSibling) {
                tablePreviousSiblingType = tablePreviousSibling.nodeName.toLowerCase();
                if (tablePreviousSiblingType === 'h1' ||  tablePreviousSiblingType === 'h2' ||  tablePreviousSiblingType === 'h3' ||  tablePreviousSiblingType === 'h4' ||  tablePreviousSiblingType === 'h5' ||  tablePreviousSiblingType === 'h6') {
                    tableBlock.insertBefore(tablePreviousSibling, tableGradientWrapper);
                }
            }

            return {
                tableGradientWrapper: tableGradientWrapper,
                tableScrollContainer: tableScrollContainer
            }
        }



        window.wrapTable = wrapTable;



        function addDragScrollHandlers(element) {
            var pressed = false;
            var startX;
            var scrollLeft;
            element.addEventListener("mousedown", function(event) {
                pressed = true;
                element.classList.add("active");
                startX = event.pageX - element.offsetLeft;
                scrollLeft = element.scrollLeft;
            });
            element.addEventListener("mouseleave", function() {
                pressed = false;
                element.classList.remove("active");
            });
            element.addEventListener("mouseup", function() {
                pressed = false;
                element.classList.remove("active");
            });
            element.addEventListener("mousemove", function(event) {
                if (!pressed) {
                    return;
                }
                event.preventDefault();
                var x = event.pageX - element.offsetLeft;
                var walk = x - startX;
                element.scrollLeft = scrollLeft - walk;
            });
        }

        scrollableTables.forEach(function(item) {

            var containers = wrapTable(item);
            var scrollableContainer = containers.tableScrollContainer
            var gradientWrapper = containers.tableGradientWrapper

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

                addDragScrollHandlers(scrollableContainer);

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
