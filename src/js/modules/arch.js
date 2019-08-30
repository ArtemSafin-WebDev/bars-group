var $ = require('jquery');
require('owl.carousel');

module.exports = {

    _elems: {
        $_      : $(),
        $slider : $(),
        $layers : $()
    },

    _slider: {
        owl : null
    },

    _state : {
        isMobile : false,
    },

    _setIsMobile: function(){
        var self = this;

        self._state.isMobile = $(window).width() <= 768;
    },

    _initSlider : function(){
        var self = this;

        if ( self._elems.$slider.length == 0 ) return;

        if(self._state.isMobile) {
            if(self._slider.owl !== null) {
                self._slider.owl.trigger('destroy.owl.carousel');
                self._slider.owl = null;
            }
            return;
        }

        if(self._slider.owl !== null) return;

        self._slider.owl = self._elems.$slider.owlCarousel({
            nav: true,
            dots: false,
            items: 1,
            auto: false,
            navContainer: '.iArch-slider__nav'
        });

        if ( self._elems.$layers.length == 0 ) return;

        self._slider.owl.on('changed.owl.carousel', function(e){
            self._elems.$layers.children('.iArch-layer').each(function(){
                $(this).removeClass('active active--1 active--2 active--3');
                $(this).addClass('active--' + (e.item.index + 1));
                if($(this).index() < (e.item.index + 1))
                    $(this).addClass('active');
            });
        });
    },

    _bindUI: function() {
        var self = this;

        $(window).resize(function () {
            if ($(window).width() <= 768)
                self._state.isMobile = true;
            else
                self._state.isMobile = false;

            self._initSlider();
        });
    },

    init: function () {
        var self = this;

        var $_ = $('.iArch');
        if ( $_.length == 0 ) return;

        self._elems.$_ = $_;
        self._elems.$slider = $_.find('.iArch-slider__list');
        self._elems.$layers = $_.find('.iArch-layers');

        self._setIsMobile();
        self._initSlider();

        self._bindUI();
    }
};