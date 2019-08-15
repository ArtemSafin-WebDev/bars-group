var $ = require('jquery');
require('owl.carousel');

module.exports = {

    _elems: {
        $_: $(),
        $slider: $(),
        $layers: $()
    },

    _initSlider : function(){
        var self = this;

        if ( self._elems.$slider.length == 0 ) return;

        var owl = self._elems.$slider.owlCarousel({
            nav: true,
            dots: false,
            items: 1,
            auto: false
        });

        if ( self._elems.$layers.length == 0 ) return;

        owl.on('changed.owl.carousel', function(e){
            self._elems.$layers.children('.iArch-layer').each(function(){
                $(this).removeClass('active active--1 active--2 active--3');
                $(this).addClass('active--' + (e.item.index + 1));
                if($(this).index() < (e.item.index + 1))
                    $(this).addClass('active');
            });
        });
    },

    init: function () {
        var self = this;

        var $_ = $('.iArch');
        if ( $_.length == 0 ) return;

        self._elems.$_ = $_;
        self._elems.$slider = $_.find('.iArch-slider');
        self._elems.$layers = $_.find('.iArch-layers');

        self._initSlider();

        /*var i = 1;

        setInterval(function(){
            $('.iArch-layer').each(function(){
                $(this).removeClass('active active-1 active-2 active-3');
                $(this).addClass('active-' + i);
                if($(this).index() < i)
                    $(this).addClass('active');
            });

            i++;
            if(i > 3) i = 1;
        }, 1500);*/
    }
};