var $ = require("jquery");
require("objectFitPolyfill");

var TechPromo = require("./techPromo");
var NavMobile = require("./navMobile");
var Overview = require("./overview");
var Catalog = require("./catalog");
var Hover = require("./hover");
var NavBanner = require("./navBanner");
var GanttSlider = require("./ganttSlider");
var CitiesSlider = require("./citiesSlider");
var SliderContent = require("./sliderContent");
var SliderDigits = require("./sliderDigits");
var SliderTabs = require("./sliderTabs");
var Header = require("./header");
var News = require("./news");
var Form = require("./form");
var ScrollableTable = require("./scrollableTable");
var NewsSlider = require("./newsSlider");
var NewsPhotoSlider = require("./newsPhotoSlider");
var NewsToggles = require("./newsToggles");
var NavSticker = require("./navSticker");
var About = require("./about");
var TAdvantages = require("./tAdvantages");
var TSliders = require("./tSliders");
var Utils = require("./utils");
var Popup = require("./popup");
var Arch = require("./arch");
var NavFilter = require("./navFilter");
var Lazyload = require("./lazyload");
var TasksSliders = require("./tTasks");
var AdvantagesSliders = require("./advantagesSlider");
var ScrollAnimations = require("./scrollAnimations");
var AboutNew = require("./aboutNew");
var Architecture = require("./architectureSlider");
var WasIntegrated = require("./wasIntegrated");
var DownloadBtns = require("./downloadBtn");
var NewAdvantagesSlider = require("./newAdvantagesSlider");
var NavBannerScrolled = require("./navBannerScrolled");
var CircleAccordeons = require("./circleAccordeons");
var StickyFilter = require("./stickyFIlter");
var TechPopovers = require("./techPromoPopovers");
var SmoothScrollPolyfill = require("smoothscroll-polyfill");
var detectIt = require("detect-it");
var StickyHeader = require("./stickyHeader");
var MobileIndustries = require('./mobileIndustries');

require("./scrollbox");

module.exports = {

    _handleDOMReady: function() {
        SmoothScrollPolyfill.polyfill();

        if (detectIt.hasTouch) {
            document.body.classList.remove("no-touch");
            document.body.classList.add("touch");
            console.log("Has touch");
        }

        // it's important to call NavBanner inition first,
        // because tabs content can contain other sliders inside
        NavBanner.init();
        CircleAccordeons.init();
        SliderContent.init();
        SliderDigits.init();
        SliderTabs.init();
        Header.init();
        News.init();
        Form.init();
        ScrollableTable.init();
        NewsSlider.init();
        NewsPhotoSlider.init();
        NewsToggles.init();
        NavSticker.init();
        About.init();
        TSliders.init();
        Arch.init();
        TasksSliders.init();
        AdvantagesSliders.init();
        NavMobile.init();
        Overview.init();
        Catalog.init();
        Hover.init();
        Popup.init();
        NavFilter.init();
        TAdvantages.init();
        Lazyload.init();
        GanttSlider.init();
        CitiesSlider.init();
        ScrollAnimations.init();
        AboutNew.init();
        Architecture.init();
        WasIntegrated.init();
        DownloadBtns.init();
        NewAdvantagesSlider.init();
        NavBannerScrolled.init();
        StickyFilter.init();
        StickyHeader.init();
        MobileIndustries.init();
    },

    _handleWindowLoad: function() {
        
        TechPromo.init();
        TechPopovers.init();
        

        $("#loader-main").removeClass("_active");

        if (window.matchMedia("(max-width: 800px)").matches) {
            return;
        }
        var videos = Array.prototype.slice.call(document.querySelectorAll('video:not(.bg-layer__video)'));


        videos.forEach(video => {
            video.classList.add('_active');
            objectFitPolyfill(video);
            if (video.hasAttribute('data-lazy')) {
                if (video.hasAttribute('data-play')) {
                    video.play();
                } else {
                    video.load();
                }
            }
        });
    },

    _bindUI: function() {
        var self = this;

        $(window).on("load", self._handleWindowLoad.bind(self));

        $(self._handleDOMReady.bind(self));
    },

    init: function() {
        var self = this;

        if (Utils.isMobile()) {
            $("html").addClass("mrkwbr-is-mobile");
        } else {
            $("html").addClass("mrkwbr-no-mobile");
        }

        self._bindUI();
    }
};
