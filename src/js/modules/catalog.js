var $ = require("jquery");
var ScrollBooster = require("scrollbooster");
var StickySidebar = require("sticky-sidebar");
var notify = require("./notify");

module.exports = {
    _elems: {
        $_: $(),
        $ctrlFilter: $(),
        $ctrlModes: $(),
        $search: $(),
        $tiles: $(),
        $names: $(),
        $popup: $(),
        $industries: $(),
        $input: $(),
        $letters: $()
    },

    _state: {
        stickySidebar: null,
        currentMode: "tiles",
        filter: {
            customer: {
                counts: {},
                value: "total"
            },
            type: {
                counts: {},
                value: "total"
            }
        },
        routingRoot: window.location.pathname,
        searchText: "",
        letter: "",
        industry: ""
    },

    _stickSidebar: function() {
        var self = this;

        self._state.stickySidebar = new StickySidebar(".js-sidebar", {
            topSpacing: 20,
            bottomSpacing: 20,
            innerWrapperSelector: ".js-sidebar-inner",
            containerSelector: ".js-sidebar-root"
        });
    },

    _initLettersScroll: function() {
        var self = this;

        var viewport = self._elems.$_.find(".search__letters")[0];
        var content = viewport.querySelector(".search__letters__inner");

        new ScrollBooster({
            viewport,
            content,
            bounce: false,
            emulateScroll: true,
            mode: "x",
            onUpdate: data => {
                content.style.transform = `translateX(${-data.position.x}px)`;
            }
        });
    },

    _renderCurrentView: function() {
        var self = this;

        switch (self._state.currentMode) {
            case "names":
                self._renderNamesView();
                break;
            case "tiles":
                self._renderTilesView();
                break;
        }
    },

    _renderFiltersView: function() {
        var self = this;

        // update side filter
        self._elems.$ctrlFilter.find(".nav-cats").each(function() {
            var filterId = $(this).data("id");
            var filterState = self._state.filter[filterId];
            $(this)
                .find(".nav-cats__item")
                .each(function() {
                    var filterItemId = $(this).data("id");
                    var isItemActive = filterState.value == filterItemId;
                    $(this)
                        .find(".nav-cats__count")
                        .html(filterState.counts[filterItemId]);
                    $(this).toggleClass("_active", isItemActive);
                });
        });

        // update popup filter
        self._elems.$popup.find("input").each(function() {
            var filterId = $(this).attr("name");
            var filterItemId = $(this).attr("value");
            var filterState = self._state.filter[filterId];
            var isChecked = filterState.value == filterItemId;
            $(this)
                .prop("checked", isChecked)
                .iCheck("update")
                .trigger("ifToggled")
                .closest(".form-filter__item")
                .find(".form-filter__count")
                .html(filterState.counts[filterItemId]);
        });
    },

    _renderSearchView: function() {
        var self = this;

        self._elems.$input.each(function() {
            if ($(this).val() == self._state.searchText) return;
            $(this)
                .val(self._state.searchText)
                .trigger("change");
        });

        self._elems.$letters.find("a").each(function() {
            var isLetterActive = $(this).text() == self._state.letter;
            $(this).toggleClass("_active", isLetterActive);
        });
    },

    _renderTilesView: function() {
        var self = this;

        // prepare url
        var url = self._elems.$_.data("tiles-url")
            .replace("{industry}", self._state.industry)
            .replace("{customer}", self._state.filter.customer.value)
            .replace("{type}", self._state.filter.type.value);

        // reset search forms view
        self._renderSearchView();

        // show common loader
        $("#loader-ajax").addClass("_active");

        // set industry loader
        self._renderIndustries("_loading");

        $.ajax({
            method: "get",
            url: url,
            dataType: "json",
            cache: false
        })
            .done(function(data) {
                self._state.filter.customer.counts = data.filterCounts.customer;
                self._state.filter.type.counts = data.filterCounts.type;

                // hide content
                setTimeout(function() {
                    self._elems.$_.addClass("_replace");
                }, 200);

                // update content
                setTimeout(function() {
                    self._elems.$names.removeClass("_active");
                    self._elems.$tiles.addClass("_active").html(data.result);
                    self._state.stickySidebar.updateSticky();
                    self._renderFiltersView();
                }, 400);

                // show content
                setTimeout(function() {
                    self._elems.$_.removeClass("_replace");
                }, 800);

                // set active class
                self._renderIndustries("_active");
            })
            .fail(function(jqXHR, textStatus) {
                // notify error
                notify("Ошибка при загрузке.", textStatus);
            })
            .always(function() {
                // hide common loader
                $("#loader-ajax").removeClass("_active");
            });
    },

    _renderNamesView: function() {
        var self = this;

        // prepare url
        var url = self._elems.$_.data("names-url")
            .replace("{searchText}", self._state.searchText)
            .replace("{letter}", self._state.letter)
            .replace("{customer}", self._state.filter.customer.value)
            .replace("{type}", self._state.filter.type.value);

        // reset industry view
        self._renderIndustries();

        // show common loader
        $("#loader-ajax").addClass("_active");

        $.ajax({
            method: "get",
            url: url,
            dataType: "json",
            cache: false
        })
            .done(function(data) {
                self._state.filter.customer.counts = data.filterCounts.customer;
                self._state.filter.type.counts = data.filterCounts.type;

                // hide content
                setTimeout(function() {
                    self._elems.$_.addClass("_replace");
                }, 200);

                // update content
                setTimeout(function() {
                    self._elems.$tiles.removeClass("_active");
                    self._elems.$names.addClass("_active").html(data.result);
                    self._state.stickySidebar.updateSticky();
                    self._renderFiltersView();
                }, 400);

                // show content
                setTimeout(function() {
                    self._elems.$_.removeClass("_replace");
                }, 800);
            })
            .fail(function(jqXHR, textStatus) {
                // notify error
                notify("Ошибка при загрузке.", textStatus);
            })
            .always(function() {
                // hide common loader
                $("#loader-ajax").removeClass("_active");
            });
    },

    _renderIndustries: function(className) {
        var self = this;

        var className = className || "";

        self._elems.$industries
            .removeClass("_active _loading")
            .filter(`[data-id="${self._state.industry}"]`)
            .addClass(className);
    },

    _handleIndustryMouseenter: function(e) {
        var self = e.data.self;

        if ($(this).hasClass("_active")) return;

        var $video = $(this).find("video._active");
        if ($video.length) $video[0].play();
    },

    _handleIndustryMouseleave: function(e) {
        var self = e.data.self;

        if ($(this).hasClass("_active")) return;

        var $video = $(this).find("video._active");
        if ($video.length) $video[0].pause();
    },

    _handleIndustryHistoryChange: function(e) {
        var self = this;
        var state = e.state;

        if (state) {
            self._state.industry = state.id ? state.id : "";
        } else {
            self._state.industry = "";
        }
        self._state.searchText = "";
        self._state.letter = "";

        self._renderCurrentView();
    },

    _setCurrentIndustryFromURL: function(e) {
        var self = this;
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("industry")) {
            var route = urlParams.get("industry");
            var element = document.querySelector(
                "[data-routing='" + route + "']"
            );
            if (element && element.hasAttribute("data-id")) {
                var id = element.getAttribute("data-id");
                self._state.industry = id;
                self._pushCurrentIndustryURL();
                self._renderTilesView();
            }
        }
    },

    _pushCurrentIndustryURL: function() {
        var self = this;
        var activeIndustryItem = document.querySelector(
            "[data-id='" + self._state.industry + "']"
        );

        if (!activeIndustryItem) {
            console.warn("No industry item for current ID has been found");
            return;
        }

        if (activeIndustryItem.hasAttribute("data-routing")) {
            var route = activeIndustryItem.getAttribute("data-routing");
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set("industry", route);
            var newRelativePathQuery =
                window.location.pathname + "?" + searchParams.toString();
            history.pushState(
                { id: self._state.industry },
                "",
                newRelativePathQuery
            );
        } else {
            console.warn("No data-routing attribute on: ", activeIndustryItem);
        }
    },

    _handleIndustryClick: function(e) {
        var self = e.data.self;

        var id = $(this).data("id");

        self._state.searchText = "";
        self._state.letter = "";

        if (self._state.industry === id) {
            self._state.industry = "";
            var urlParams = new URLSearchParams(window.location.search);

            if (urlParams.has("industry")) {
                urlParams.delete("industry");
                var newRelativePathQuery =
                    window.location.pathname + "?" + urlParams.toString();
                history.pushState(null, "", newRelativePathQuery);
            }
        } else {
            self._state.industry = id;
            self._pushCurrentIndustryURL();
        }

        self._renderTilesView();
    },

    _handleCtrlModesLink: function(e) {
        var self = e.data.self;

        e.preventDefault();

        var $currItem = $(this).closest(".nav-side__item");
        if ($currItem.hasClass("_active")) return;

        // set active class
        $currItem
            .addClass("_active")
            .siblings()
            .removeClass("_active");

        // set arrow position
        self._elems.$ctrlModes.find(".nav-side__arrow").css({
            transform: "translateY(" + $currItem.index() * 100 + "%)"
        });

        // toggle search form
        var isFormActive = !!$currItem.index();
        self._elems.$search.toggleClass("_active", isFormActive);

        // clear state
        (self._state.searchText = ""),
            (self._state.letter = ""),
            (self._state.industry = ""),
            (self._state.currentMode = $currItem.data("id"));

        self._renderCurrentView();
        self._renderSearchView();
    },

    _handleSearchKeyup: function(e) {
        var self = e.data.self;

        self._state.searchText = $(this).val();
        self._renderSearchView();

        var ENTER_CODE = 13;
        if (e.which == ENTER_CODE) {
            $(this).blur();
        }
    },

    _handleLetterClick: function(e) {
        var self = e.data.self;

        e.preventDefault();

        self._state.letter = $(this).text();
        self._state.searchText = "";

        self._renderNamesView();
        self._renderSearchView();
        self._elems.$input.blur();
    },

    _handleFormSubmit: function(e) {
        var self = e.data.self;

        e.preventDefault();

        self._state.letter = "";

        self._renderNamesView();
    },

    _handleFilterLink: function(e) {
        var self = e.data.self;

        e.preventDefault();

        var filterId = $(this)
            .closest(".nav-cats")
            .data("id");
        self._state.filter[filterId].value = $(this)
            .closest(".nav-cats__item")
            .data("id");

        self._renderCurrentView();
    },

    _handlePopupReset: function(e) {
        var self = e.data.self;

        e.preventDefault();

        self._state.filter.customer.value = "total";
        self._state.filter.type.value = "total";
        self._renderCurrentView();
        $.fancybox.close();
    },

    _handlePopupApply: function(e) {
        var self = e.data.self;

        e.preventDefault();

        var $popup = self._elems.$popup;
        self._state.filter.customer.value = $popup
            .find('[name="customer"]:checked')
            .val();
        self._state.filter.type.value = $popup
            .find('[name="type"]:checked')
            .val();
        self._renderCurrentView();
        $.fancybox.close();
    },

    _bindUI: function() {
        var self = this;

        self._elems.$_.on(
            "mouseenter",
            ".nav-video__item",
            { self: self },
            self._handleIndustryMouseenter
        );
        self._elems.$_.on(
            "mouseleave",
            ".nav-video__item",
            { self: self },
            self._handleIndustryMouseleave
        );
        self._elems.$_.on(
            "click",
            ".nav-video__item",
            { self: self },
            self._handleIndustryClick
        );
        self._elems.$_.on(
            "click",
            ".nav-side__link",
            { self: self },
            self._handleCtrlModesLink
        );
        self._elems.$_.on(
            "keyup",
            ".js-catalog-search",
            { self: self },
            self._handleSearchKeyup
        );
        self._elems.$_.on(
            "click",
            ".search__letters a",
            { self: self },
            self._handleLetterClick
        );
        self._elems.$_.on(
            "submit",
            ".js-catalog-form",
            { self: self },
            self._handleFormSubmit
        );
        self._elems.$_.on(
            "click",
            ".nav-cats__link",
            { self: self },
            self._handleFilterLink
        );
        self._elems.$popup.on(
            "click",
            ".form-filter__reset",
            { self: self },
            self._handlePopupReset
        );
        self._elems.$popup.on(
            "click",
            ".js-catalog-apply",
            { self: self },
            self._handlePopupApply
        );

        window.addEventListener(
            "popstate",
            self._handleIndustryHistoryChange.bind(this)
        );
    },

    init: function() {
        var self = this;

        var $_ = $("#catalog");

        if ($_.length == 0) return;

        self._elems.$_ = $_;
        self._elems.$ctrlModes = $("#catalog-ctrl-modes");
        self._elems.$ctrlFilter = $("#catalog-ctrl-filter");
        self._elems.$search = $("#catalog-search");
        self._elems.$tiles = $("#catalog-tiles");
        self._elems.$names = $("#catalog-names");
        self._elems.$popup = $("#catalog-popup");
        self._elems.$industries = $_.find(".nav-video__item");
        self._elems.$input = $_.find(".js-catalog-search");
        self._elems.$letters = $_.find(".search__letters");
        self._setCurrentIndustryFromURL();

        self._stickSidebar();
        self._initLettersScroll();

        self._bindUI();
    }
};
