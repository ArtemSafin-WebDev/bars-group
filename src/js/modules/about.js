var $ = require('jquery');
require("rangeslider.js");
require('owl.carousel');

module.exports = {

    _elems: {
        $_: $(),
        $iScroll: $()
    },

    _state:  {
        isMobile : false,
        scrollType : false,
        run : false
    },
    
    _setIsMobile: function(){
        var self = this;

        self._state.isMobile = $(window).width() <= 576;
    },

    _setBodyHeight: function(){
        var self = this;

        if ($(window).width() >= self._elems.$iScroll.children().width()) {
            $('body').height($(window).width() * self._elems.$iScroll.children().length);
        } else {
            $('body').height(self._elems.$iScroll.width());
        }
    },

    _setScrollWidth: function(){
        var self = this;

        if ($(window).width() >= self._elems.$iScroll.children().width()) {
            self._elems.$iScroll.width($(window).width() * self._elems.$iScroll.children().length);
        }
    },

    _initRangeSlider: function () {
        var self = this;

        var $range = self._elems.$_.find('.gantt-slider__range');
        $range.data('position', 0);
        $range.find('input').rangeslider({
            polyfill: false,
            onInit: function () {
                $range.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
            },
            onSlide: function(position, value) {
                if (value == self._state.lastRangeValue) return;
                self._state.lastRangeValue = value;

                if (self._elems.$iScroll.data('direction') == 'right') {
                    if (position < $range.data('position')) {
                        self._elems.$iScroll.data('direction', 'left');
                    }
                } else if (self._elems.$iScroll.data('direction') == 'left') {
                    if (position > $range.data('position')) {
                        self._elems.$iScroll.data('direction', 'right');
                    }
                }

                $range.data('position', position);

                var maxScrollLeft = self._elems.$iScroll.width() - self._elems.$iScroll.width() / self._elems.$iScroll.children().length;
                var scrollLeft    = maxScrollLeft / 1000 * value;
                self._elems.$_.find('.gantt-slider__scroll').scrollLeft(scrollLeft);
                if(self._state.scrollType == 'range')
                    $(window).scrollTop(scrollLeft);
            }
        });
    },

    _initGeo: function(){
        var self = this;

        var $iGeo = self._elems.$_.find('.iGeo');
        if ($iGeo.length == 0) return;

        var $iGeoMap   = $iGeo.find('.iGeo__map');
        var $iGeoItems = $iGeo.find('.iGeo__items');
        var $iGeoItem  = $iGeoItems.children('.iGeo__item');

        var offsetTop = self._state.isMobile ? 200 : 63;

        var iGeoMapHeight = $iGeoMap.height() + offsetTop;
        var iGeoMapWidth  = $iGeoMap.width();

        $iGeoItems.width(!self._state.isMobile ? $iGeoMap.width() : '100%');

        $iGeoItem.each(function(){
            var top = 0;
            var left = 0;

            if ($(this).data('top') > 0) {
                top = $(this).data('top') / iGeoMapHeight * 100;
            }
            
            if ($(this).data('left') > 0) {
                left = $(this).data('left') / iGeoMapWidth * 100 + 0.75;
            }

            if (self._state.isMobile) {
                top = Math.max(0, top - 40);
            }

            $(this).stop().animate({'top': top + '%', 'left': left + '%'}, 1000).addClass('iGeo__item--active');
        });
    },
    _initDigits: function(){
        var self = this;

        var $iDigits = self._elems.$_.find('.iDigits');
        if ($iDigits.length == 0) return;

        var $iDigitsSlides = $iDigits.find('.iDigits-slides.owl-carousel');
        var $iDigitsValues = $iDigitsSlides.find('.iDigits-values');
        var $iDigitsValueItem = $iDigitsSlides.find('.iDigits-values__item');

        var owlDigits = $iDigitsSlides.owlCarousel({
            nav: false,
            dots: false,
            items: 1,
            auto: false,
            responsive: {
                568 : {
                    nav : true
                }
            }
        });

        owlDigits.on('changed.owl.carousel', function(e){
            $iDigitsValueItem.removeClass($iDigitsValues.data('active'));
            $iDigitsValueItem.eq(e.item.index).addClass($iDigitsValues.data('active'));
        });

        $iDigitsValueItem.eq(0).addClass($iDigitsValues.data('active'));

        $iDigitsValueItem.click(function(){
            $('.iDigits-values__item').removeClass($('.iDigits-values').data('active'));

            $(this).addClass($('.iDigits-values').data('active'));

            var index = self._state.isMobile ? $(this).parent().index() : $(this).index();

            $('.iDigits .owl-carousel').trigger('to.owl.carousel', index);
        });

        if(self._state.isMobile){
            var owlDigitsValues = $('.iDigits-values.owl-carousel').owlCarousel({
                nav: false,
                dots: false,
                auto: false,
                autoWidth: true
            });
        }
    },
    _initLeadership: function(){
        var self = this;

        var $iLeadership = self._elems.$_.find('.iLeadership');
        if ($iLeadership.length == 0) return;

        var $iLeadershipItem = $iLeadership.find('.iLeadership-item');
        var $iLeadershipModal = $("#leadershipModal");

        var height = $iLeadershipItem.eq(0).height();
        $iLeadershipItem.width(height*0.8);

        $iLeadership.find('.button-aurora').click(function(e){
            e.preventDefault();

            if(self._state.isMobile) {
                if ($(this).hasClass('opened')) {
                    $iLeadership.find('.page__center').removeClass('opened');
                    $(this).removeClass('opened').children('.button-aurora__text').text('Показать еще');
                    $(this).children('i').show();
                } else {
                    $iLeadership.find('.page__center').addClass('opened');
                    $(this).addClass('opened').children('.button-aurora__text').text('Скрыть');
                    $(this).children('i').hide();
                }
            }
        });

    },

    _initHistory: function(){
        var self = this;

        var $iHistory = self._elems.$_.find('.iHistory');
        if ($iHistory.length == 0) return;

        var ruler = $iHistory.find('.iHistory-ruler__line .owl-carousel');
        var es = $iHistory.find('.iHistory-es .owl-carousel');

        if(ruler.length == 0) return;
        if(es.length == 0) return;

        var owlRuler = ruler.owlCarousel({
            nav: false,
            dots: false,
            items: Math.min(14, ruler.data('count')),
            auto: false
        });

        var owles = es.owlCarousel({
            nav: false,
            dots: false,
            items: 1,
            auto: false
        });

        $iHistory.find('.iHistory-ruler__item a').click(function(e){
            e.preventDefault();

            $iHistory.find('.iHistory-ruler__item').removeClass('iHistory-ruler__item--active');

            $(this).parent().addClass('iHistory-ruler__item--active');

            es.trigger('to.owl.carousel', $(this).parents('.owl-item').index() + 1);
        });
    },

    _initNav: function(){
        var self = this;

        var $iNav = self._elems.$_.find('.iNav');
        if ($iNav.length == 0) return;

        $iNav.children('a').click(function(e){
            e.preventDefault();

            var $target = $($(this).attr('href'));
            if($target.length == 0) return;

            var scrollLeft = self._elems.$_.find('.gantt-slider__scroll').scrollLeft();
            self._elems.$_.find('.gantt-slider__scroll').scrollLeft(scrollLeft + $target.offset().left);
        });
    },

    _handleSliderScroll: function (e) {
        var self = e.data.self;

        if(self._elems.$_.find('.gantt-slider__scroll').hasClass('window-scroll'))
            self._elems.$_.find('.gantt-slider__scroll').removeClass('window-scroll')
        else
            self._state.scrollType = 'range';

        var scrollLeft = self._elems.$_.find('.gantt-slider__scroll').scrollLeft();
        var maxScrollLeft = self._elems.$iScroll.width() - self._elems.$iScroll.width() / self._elems.$iScroll.children().length;
        var rangeValue = Math.round(1000 * scrollLeft / maxScrollLeft);
        self._elems.$_.find('.gantt-slider__range input').val(rangeValue).change();

        var img = $('#wrapper .brand-box__image img');

        self._elems.$iScroll.children('.iScroll-item').each(function(){
            if(
                self._elems.$iScroll.data('direction') == 'right' && $(this).offset().left >= 0 && $(this).offset().left < 360
                ||
                self._elems.$iScroll.data('direction') == 'left' && $(this).width() + $(this).offset().left > 200 && $(this).width() + $(this).offset().left < 1600
            ){
                if($(this).find('.iScroll-item__label') !== undefined && $(this).find('.iScroll-item__label').length) {
                    $('#wrapper .page__label').text($(this).find('.iScroll-item__label').text());
                }
                else
                    $('#wrapper .page__label').text('О компании');

                if($(this).hasClass('iRatings')) {
                    img.attr('src', img.data('white'));
                    $(this).addClass('active');
                }
                else
                    img.attr('src', img.data('original'));
            }
        });
    },

    _bindUI: function(){
        var self = this;

        if(!self._state.isMobile) {
            self._initRangeSlider();
        }

        $(window).resize(function(){
            if($(window).width() <= 576)
                self._state.isMobile = true;
            else
                self._state.isMobile = false;
        });

        $(window).scroll(function(){
            if(!self._state.isMobile) {
                self._state.scrollType = 'window';
                self._elems.$_.find('.gantt-slider__scroll').scrollLeft($(window).scrollTop()).addClass('window-scroll');

                self._elems.$_.find('[data-factor]').each(function(){
                    var parent = $(this).parents('.iScroll-item');
                    if(parent.length == 0) return;

                    if((parent.offset().left < $(window).width() + 100) && (parent.offset().left + parent.width()) > -100){
                        $(this).css({
                            'transform': 'translate(' + parent.offset().left * $(this).data('factor') + 'px, 0px)',
                            'transition': 'transform 0.2s linear 0s',
                            'will-change': 'transform'
                        });
                    }
                });
            }
        });

        if(!self._state.isMobile){
            self._elems.$_.find('.gantt-slider__scroll').on('scroll', {self: self}, self._handleSliderScroll);
            //$(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
        }

    },

    init: function () {
        var self = this;

        var $_ = $('#about-slider');

        if ( $_.length == 0 ) return;

        self._elems.$_ = $_;
        self._elems.$iScroll = $_.find('.iScroll');

        self._setIsMobile();
        self._setBodyHeight();
        self._setScrollWidth();
        self._initGeo();
        self._initDigits();
        self._initLeadership();
        self._initHistory();
        self._initNav();

        self._bindUI();
    }
};