var $ = require("jquery");
var Rellax = require("rellax");
var ScrollBooster = require("scrollbooster");
var TweenLite = require("TweenLite");
require("gsap/umd/ScrollToPlugin");
require("gsap/umd/CSSPlugin");
require("rangeslider.js");

var Utils = require("./utils");

module.exports = {
    _cache: {
        gantt: {}
    },

    _elems: {
        $_: $(),
        $sandbox: $(),
        $inner: $(),
        $scroll: $(),
        $canvas: $(),
        $types: $(),
        $lines: $(),
        $items: $(),
        $ctrl: $(),
        $range: $(),
        $itemClone: $(),
        $typeClone: $()
    },

    _state: {
        currentView: "gantt",
        groupedItems: [],
        randomItems: [],
        maxScrollLeft: 0,
        lastRangeValue: 0,
        timeout: null,
        rellax: null,
        animating: false
    },

    _initParallax: function() {
        var self = this;

        self._state.rellax = new Rellax("[data-rellax-speed]", {
            horizontal: true,
            vertical: false,
            wrapper: "#gantt-slider .gantt-slider__scroll",
            center: true
        });
    },

    _destroyParallax: function() {
        var self = this;

        if (self._state.rellax == null) return;
        self._state.rellax.destroy();
    },

    _getGanttPattern: function(width, height) {
        // imagine, that we have some picture, which contains 7 rectangles.
        // pattern object properties describe how we can draw the picture

        var multiplier = 1.1;

        // var PATTERN = {
        //     canvasWidth: 2350 * multiplier,
        //     canvasHeight: 400,
        //     rectWidth: 510,
        //     rectHeight: 160,
        //     coords: [
        //         [60 * multiplier, 250],
        //         [200 * multiplier, 30],
        //         [675 * multiplier, 210],
        //         [1250 * multiplier, 260],
        //         [1015 * multiplier, 0],
        //         [1740 * multiplier, 5],
        //         [1890 * multiplier, 170]
        //     ]
        // };

        var PATTERN = {
            canvasWidth: 2350 * multiplier,
            canvasHeight: 460,
            rectWidth: 510,
            rectHeight: 160,
            coords: [
                [60 * multiplier, 250],
                [400 * multiplier, 30],
                [675 * multiplier, 210],
                [1250 * multiplier, 260],
                [1015 * multiplier, 0],
                [1740 * multiplier, 5],
                [1890 * multiplier, 170]
            ]
        };

        // items' width and height will change on different screen sizes
        // so we need to have a pattern suitable for new item's dimensions
        var result = {};
        result.canvasWidth = parseInt(
            (PATTERN.canvasWidth / PATTERN.rectWidth) * width
        );
        result.canvasHeight = parseInt(
            (PATTERN.canvasHeight / PATTERN.rectHeight) * height
        );
        result.coords = [];
        PATTERN.coords.forEach(function(coord) {
            result.coords.push([
                parseInt((coord[0] / PATTERN.canvasWidth) * result.canvasWidth),
                parseInt(
                    (coord[1] / PATTERN.canvasHeight) * result.canvasHeight
                )
            ]);
        });

        return result;
    },

    // create elems clone to get their dimenstions
    _createElemsClones: function() {
        var self = this;

        var $itemClone = self._elems.$items.eq(0).clone();
        $itemClone.appendTo(self._elems.$sandbox);
        self._elems.$itemClone = $itemClone;

        var $typeClone = self._elems.$types.eq(0).clone();
        $typeClone.appendTo(self._elems.$sandbox);
        self._elems.$typeClone = $typeClone;
    },

    _checkScrollProgress: function(prev, next) {
        var self = this;

        var viewport = self._elems.$scroll[0];

        var reachedEnd =
            viewport.scrollLeft + document.documentElement.clientWidth ===
            viewport.scrollWidth;
        var reachedStart = viewport.scrollLeft === 0;

        if (reachedEnd) {
            next.disabled = true;
            return "end";
        } else if (reachedStart) {
            prev.disabled = true;
            return "start";
        } else {
            next.disabled = false;
            prev.disabled = false;
            return "middle";
        }
    },

    _slideRight: function() {
        var self = this;

        var viewport = self._elems.$scroll[0];

        if (Element.prototype.scrollBy) {
            viewport.scrollBy({
                top: 0,
                left: document.documentElement.clientWidth / 2,
                behavior: "smooth"
            });
        } else {
            TweenLite.to(viewport, 2, {
                scrollTo: {
                    x:
                        viewport.scrollLeft +
                        document.documentElement.clientWidth / 2
                }
            });
        }
    },
    _slideLeft: function() {
        var self = this;

        var viewport = self._elems.$scroll[0];

        if (Element.prototype.scrollBy) {
            viewport.scrollBy({
                top: 0,
                left: -1 * document.documentElement.clientWidth / 2,
                behavior: "smooth"
            });
        } else {
            TweenLite.to(viewport, 2, {
                scrollTo: {
                    x:
                        viewport.scrollLeft -
                        document.documentElement.clientWidth / 2
                }
            });
        }
    },

    _sortItemsByGroup: function() {
        var self = this;

        var groupedItems = [];
        self._elems.$items.each(function(index, item) {
            var id = $(item).data("rel");
            if (typeof groupedItems[id] === "undefined") groupedItems[id] = [];
            groupedItems[id].push(item);
        });
        self._state.groupedItems = groupedItems;
    },

    // picks items from different groups and puts them into one array
    _sortItemsRandomly: function() {
        var self = this;

        var totalCount = 0;
        var helperArray = [];
        self._state.groupedItems.forEach(function(items, index) {
            helperArray[index] = items.slice().reverse();
            totalCount += items.length;
        });

        var randomItems = [];
        var viewedCount = 0;
        while (viewedCount < totalCount) {
            helperArray.forEach(function(items) {
                if (items.length == 0) return;
                randomItems.push(items.pop());
                viewedCount++;
            });
        }

        self._state.randomItems = randomItems;
    },

    _getGanttViewCalcs: function() {
        var self = this;

        // get vars for cacheId
        var itemWidth = self._elems.$itemClone.outerWidth();
        var itemHeight = self._elems.$itemClone.outerHeight();

        var cacheId = itemWidth + "x" + itemHeight;
        if (!self._cache.gantt[cacheId]) {
            var result = {
                canvas: {},
                items: []
            };

            // save items positions
            var pattern = self._getGanttPattern(itemWidth, itemHeight);
            var maxLeftPos = 0;

            self._state.randomItems.forEach(function(item, index) {
                var baseIndex = index % pattern.coords.length;
                var factor = Math.floor(index / pattern.coords.length);

                var leftPos =
                    pattern.coords[baseIndex][0] + pattern.canvasWidth * factor;
                var topPos = pattern.coords[baseIndex][1];

                result.items[index] = {
                    left: leftPos,
                    top: topPos
                };

                if (leftPos > maxLeftPos) maxLeftPos = leftPos;
            });

            // save canvas size
            result.canvas.width = maxLeftPos + itemWidth + pattern.coords[0][0];
            result.canvas.height = pattern.canvasHeight;

            self._cache.gantt[cacheId] = result;
        }

        return self._cache.gantt[cacheId];
    },

    _switchToGanttView: function(initial) {
        var self = this;

        self._elems.$_.addClass("gantt-slider--gantt-view");
        self._elems.$sandbox.addClass("gantt-slider--gantt-view");

        var calcs = self._getGanttViewCalcs();

        // set items positions
        self._state.randomItems.forEach(function(item, index) {
            if (initial) {
                $(item).css({
                    left: calcs.items[index].left,
                    top: calcs.items[index].top
                });
            } else {
                self._state.animating = true;
                document.body.classList.add("gantt-animating");
                TweenLite.to(item, 0.5, {
                    left: calcs.items[index].left,
                    top: calcs.items[index].top,
                    onComplete: function() {
                        self._state.animating = false;
                        document.body.classList.remove("gantt-animating");
                    }
                });
            }
        });

        // set canvas size
        self._elems.$canvas.css({
            width: calcs.canvas.width,
            height: calcs.canvas.height
        });

        if (!initial) {
            self._elems.$scroll.scrollLeft(0);
        }

        self._state.currentView = "gantt";
        self._updateScrollCalcs();
    },

    _switchToLinesView: function(initial) {
        var self = this;

        self._elems.$_.removeClass("gantt-slider--gantt-view");
        self._elems.$sandbox.removeClass("gantt-slider--gantt-view");

        // inner offset
        var innerOffset = parseInt(self._elems.$inner.css("padding-left"));

        // get item dimentions
        var itemWidth = self._elems.$itemClone.outerWidth();
        var itemHeight = self._elems.$itemClone.outerHeight();
        var itemOffsetY = parseInt(self._elems.$itemClone.css("margin-bottom"));
        var itemOffsetX = parseInt(self._elems.$itemClone.css("margin-right"));
        // var itemOffsetX = 80;
       

        // get type dimensions
        var typeWidth = self._elems.$typeClone.width();

        // get start pos
        var centerStart = self._elems.$ctrl.offset().left;

        var lineCounter = 0;
        var maxLeftPos = 0;
        var maxTopPos = 0;

        self._state.groupedItems.forEach(function(items, index) {
            var topPos = lineCounter * (itemHeight + itemOffsetY);

            // items
            items.forEach(function(item, index) {
                var leftPos =
                    centerStart + typeWidth + index * (itemWidth + itemOffsetX);

                if (initial) {
                    $(item).css({
                        top: topPos,
                        left: leftPos
                    });
                } else {
                    self._state.animating = true;
                    document.body.classList.add("gantt-animating");
                    TweenLite.to(item, 0.5, {
                        top: topPos,
                        left: leftPos,
                        onComplete: function() {
                            self._state.animating = false;
                            document.body.classList.remove("gantt-animating");
                        }
                    });
                }

                if (leftPos > maxLeftPos) maxLeftPos = leftPos;
            });

            // types
            self._elems.$types.filter('[data-rel="' + index + '"]').css({
                top: topPos,
                left: centerStart
            });

            // lines
            self._elems.$lines.filter('[data-rel="' + index + '"]').css({
                top: topPos,
                left: centerStart
            });

            if (topPos > maxTopPos) maxTopPos = topPos;
            lineCounter++;
        });

        // set lines size
        self._elems.$lines.css({
            width: maxLeftPos + itemWidth - centerStart
        });

        // set canvas size
        self._elems.$canvas.css({
            width: maxLeftPos + itemWidth + innerOffset,
            height: maxTopPos + itemHeight + itemOffsetY
        });

        if (!initial) {
            self._elems.$scroll.scrollLeft(0);
        }

        self._state.currentView = "lines";
        self._updateScrollCalcs();
    },

    _updateScrollCalcs: function() {
        var self = this;

        // update maxScrollLeft
        var maxScrollLeft = self._elems.$canvas.width() - $(window).width();
        self._elems.$range.toggleClass(
            "gantt-slider__range--hidden",
            maxScrollLeft < 0
        );
        self._state.maxScrollLeft = maxScrollLeft;

        // update handle position
        self._updateHandlePosition();
    },

    _updateHandlePosition: function() {
        var self = this;

        var scrollLeft = self._elems.$scroll.scrollLeft();
        var rangeValue = Math.round(
            (1000 * scrollLeft) / self._state.maxScrollLeft
        );
        self._elems.$range
            .find("input")
            .val(rangeValue)
            .change();
    },

    _initRangeSlider: function() {
        var self = this;

        var $rangeslider = $();

        self._elems.$range.find("input").rangeslider({
            polyfill: false,
            onInit: function() {
                $rangeslider = self._elems.$range.find(".rangeslider");
                $rangeslider
                    .find(".rangeslider__handle")
                    .html("<i></i><i></i><i></i>");
            },
            onSlide: function(position, value) {
                if (value == self._state.lastRangeValue) return;
                self._state.lastRangeValue = value;

                var isHandleActive = $rangeslider.hasClass(
                    "rangeslider--active"
                );
                if (!isHandleActive) return;

                var scrollLeft = (self._state.maxScrollLeft / 1000) * value;
                self._elems.$scroll.scrollLeft(scrollLeft);
            }
        });
    },

    _initScrollBooster: function() {
        var self = this;

        if (Utils.isTouchDevice()) return;

        var viewport = self._elems.$scroll[0];
        var content = self._elems.$canvas[0];

        new ScrollBooster({
            viewport,
            content,
            bounce: false,
            textSelection: true,
            mode: "x",
            onUpdate: data => {
                viewport.scrollLeft = data.position.x;
            }
        });
    },

    _setInitialOffset: function() {
        var self = this;

        self._elems.$scroll.scrollLeft($(window).width() * 2);
        setTimeout(function() {
            TweenLite.to(self._elems.$scroll[0], 2, { scrollTo: { x: 100 } });
        }, 200);
    },

    _handleWindowResize: function(e) {
        var self = e.data.self;

        switch (self._state.currentView) {
            case "gantt":
                self._switchToGanttView();
                break;
            case "lines":
                self._switchToLinesView();
                break;
        }
    },

    _handleToggleButton: function(e) {
        var self = e.data.self;

        e.preventDefault();

        if (self._state.animating) {
            return;
        }

        this.classList.toggle("active");

        switch (self._state.currentView) {
            case "gantt":
                self._destroyParallax();
                self._elems.$items.each(function() {
                    this.style.transform = "";
                });
                self._switchToLinesView();
                break;
            case "lines":
                self._switchToGanttView();
                setTimeout(function() {
                    self._elems.$_.addClass("gantt-slider--parallax-inition");
                    self._initParallax();
                }, 500);
                setTimeout(function() {
                    self._elems.$_.removeClass(
                        "gantt-slider--parallax-inition"
                    );
                }, 1000);
                break;
        }
    },

    _handleSliderScroll: function(e) {
        var self = this;

        self._updateHandlePosition();
    },

    _handleItemMouseenter: function(e) {
        var $video = $(this).find("video._active");
        if ($video.length) $video[0].play();
    },

    _handleItemMouseleave: function(e) {
        // var self = e.data.self;

        var $video = $(this).find("video._active");
        if ($video.length) $video[0].pause();
    },

    _bindUI: function() {
        var self = this;

        var prev = document.querySelector(".js-gantt-slider-prev");
        var next = document.querySelector(".js-gantt-slider-next");

        if (prev) {
            var slideLeft = self._slideLeft.bind(this);
            prev.addEventListener("click", function(event) {
                event.preventDefault();
                slideLeft(prev);
            });
        }

        if (next) {
            var slideRight = self._slideRight.bind(this);

            next.addEventListener("click", function(event) {
                event.preventDefault();
                slideRight(next);
            });
        }

        var viewport = self._elems.$scroll[0];

        viewport.addEventListener(
            "scroll",
            function() {
                self._checkScrollProgress(prev, next);
            },
            { passive: true }
        );

        self._elems.$_.on(
            "mouseenter",
            ".gantt-slider__item",
            { self: self },
            self._handleItemMouseenter
        );
        self._elems.$_.on(
            "mouseleave",
            ".gantt-slider__item",
            { self: self },
            self._handleItemMouseleave
        );
        self._elems.$_.on(
            "click",
            ".gantt-slider__switch",
            { self: self },
            self._handleToggleButton
        );
        self._elems.$scroll[0].addEventListener(
            "scroll",
            self._handleSliderScroll.bind(self),
            { passive: true }
        );
        $(window).on("resize", { self: self }, self._handleWindowResize);
    },

    init: function() {
        var self = this;

        var $_ = $("#gantt-slider");
        if ($_.length == 0) return;

        self._elems.$_ = $_;
        self._elems.$sandbox = $("#gantt-slider-sandbox");
        self._elems.$inner = $_.find(".page__inner").first();
        self._elems.$scroll = $_.find(".gantt-slider__scroll");
        self._elems.$canvas = $_.find(".gantt-slider__canvas");
        self._elems.$types = $_.find(".gantt-slider__type");
        self._elems.$lines = $_.find(".gantt-slider__line");
        self._elems.$items = $_.find(".gantt-slider__item");
        self._elems.$ctrl = $_.find(".gantt-slider__ctrl");
        self._elems.$range = $_.find(".gantt-slider__range");

        self._createElemsClones();
        self._sortItemsByGroup();
        self._sortItemsRandomly();

        if (window.matchMedia("(max-width: 800px)").matches) {
            // self._elems.$items.each(function() {
            //     this.style.transform = "";
            // });
            self._switchToLinesView(true);
        } else {
            self._switchToGanttView(true);
        }

        self._initRangeSlider();
        self._initScrollBooster();
        if (window.matchMedia("(max-width: 800px)").matches) {
            self._destroyParallax();
        } else {
            self._initParallax();
        }
        self._elems.$_.removeClass("gantt-slider--frozen _loading");

        // self._setInitialOffset();

        self._bindUI();
    }
};
