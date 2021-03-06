var $ = require('jquery');
require("rangeslider.js");
require('owl.carousel');
require('jquery.nicescroll');

var Utils = require('./utils');

module.exports = {

    _elems: {
        $_: $(),
        $iScroll: $()
    },

    _state: {
        isAdminPage: false,
        isMobile: false,
        windowRatio: 1,
        scrollType: false,
        run: false
    },

    _setIsAdminPage: function () {
        var self = this;

        self._state.isAdminPage = $('body').hasClass('is-admin');
    },
    _setIsMobile: function () {
        var self = this;

        self._state.isMobile = $(window).width() <= 576;
    },

    _setWindowRatio: function () {
        var self = this;

        self._state.windowRatio = $(window).width() / $(window).height();
    },

    _setBodyHeight: function () {
        var self = this;

        $('body').height('auto');

        if (self._state.isAdminPage) return;
        if (self._state.isMobile) return;
        if (Utils.isTouchDevice()) return;

        if ($(window).width() >= self._elems.$iScroll.children().width()) {
            $('body').height($(window).width() / self._state.windowRatio * self._elems.$iScroll.children().length);
        } else {
            $('body').height(self._elems.$iScroll.width() / self._state.windowRatio);
        }
    },

    _setScrollWidth: function () {
        var self = this;

        if (self._state.isMobile) return;
        if (self._state.isAdminPage) return;

        if ($(window).width() >= self._elems.$iScroll.children().width()) {
            self._elems.$iScroll.width($(window).width() * self._elems.$iScroll.children().length);
        }
    },

    _resetDesktop: function () {
        var self = this;

        if (!self._state.isMobile) return;

        $('body').height('auto');
        self._elems.$iScroll.width('');
        self._elems.$scroll.scrollLeft(0);
        self._elems.$_.find('[data-factor]').css({'transform': 'translate3d(0, 0, 0)'});
    },
    _initGeo: function () {
        var self = this;

        var $iGeo = self._elems.$_.find('.iGeo');
        if ($iGeo.length == 0) return;

        var $iGeoMap = $iGeo.find('.iGeo__map');
        var $iGeoItems = $iGeo.find('.iGeo__items');
        var $iGeoItem = $iGeoItems.children('.iGeo__item');

        var offsetTop = self._state.isMobile ? 200 : 63;

        var iGeoMapHeight = $iGeoMap.height() + offsetTop;
        var iGeoMapWidth = $iGeoMap.width();

        $iGeoItems.width(!self._state.isMobile ? $iGeoMap.width() : '100%');

        $iGeoItem.each(function () {
            var top = 0;
            var left = 0;

            if ($(this).data('top') > 0) {
                if (self._state.isMobile) {
                    top = $(this).data('top') * (iGeoMapHeight / 765) / iGeoMapHeight * 100;
                } else {
                    top = $(this).data('top') * (iGeoMapHeight / 987) / iGeoMapHeight * 100;
                }
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
    _initDigits: function () {
        var self = this;

        var $iDigits = self._elems.$_.find('.iDigits');
        if ($iDigits.length == 0) return;

        var $iDigitsSlides = $iDigits.find('.iDigits-slides.owl-carousel');
        var $iDigitsValues = $iDigits.find('.iDigits-values.owl-carousel');
        var $iDigitsValueItem = $iDigitsValues.find('.iDigits-values__item');

        var owlDigits = $iDigitsSlides.owlCarousel({
            nav: false,
            dots: false,
            items: 1,
            auto: false,
            autoHeight:true,
            touchDrag  : false,
            mouseDrag  : false,
            responsive: {
                568: {
                    nav: true,
                    autoHeight:false
                }
            }
        });

        owlDigits.on('changed.owl.carousel', function (e) {
            $iDigitsValueItem.removeClass($iDigitsValues.data('active'));
            $iDigitsValueItem.eq(e.item.index).addClass($iDigitsValues.data('active'));
            if (self._state.isMobile) {
                $iDigitsValues.trigger('to.owl.carousel', e.item.index);
            }
        });

        $iDigitsValueItem.eq(0).addClass($iDigitsValues.data('active'));

        $iDigitsValueItem.click(function (e) {
            e.preventDefault();

            $('.iDigits-values__item').removeClass($iDigitsValues.data('active'));

            $(this).addClass($iDigitsValues.data('active'));

            var index = self._state.isMobile ? $(this).parent().index() : $(this).index();

            $iDigitsSlides.trigger('to.owl.carousel', index);
        });

        if (self._state.isMobile) {
            $iDigitsValues.owlCarousel({
                nav: false,
                dots: false,
                auto: false,
                autoWidth: true
            });
        }
    },
    _initLeadership: function () {
        var self = this;

        var $iLeadership = self._elems.$_.find('.iLeadership');
        if ($iLeadership.length == 0) return;

        var $iLeadershipItem = $iLeadership.find('.iLeadership-item');
        var $iLeadershipToggle = $iLeadership.find('.button-aurora');

        var $iPartners = self._elems.$_.find('.iPartners');
        var $iPartnersToggle = $iPartners.length ? $iPartners.find('.button-aurora') : $();

        var height = $iLeadershipItem.eq(0).height();
        $iLeadershipItem.width(height * 0.8);

        $(window).resize(function () {
            var height = $iLeadershipItem.eq(0).height();
            $iLeadershipItem.width(height * 0.8);

            self._elems.$iScroll.width('');

            $iLeadership.removeClass('opened');
            $iLeadershipToggle.removeClass('opened');
            $iLeadershipToggle.children('.button-aurora__text').text('Показать еще');
            $iLeadershipToggle.children('i').show();
        });

        $iLeadershipToggle.click(function (e) {
            e.preventDefault();

            if ($iPartners.length && $iPartnersToggle.length) {
                $iPartners.removeClass('opened');
                $iPartnersToggle.removeClass('opened').children('.button-aurora__text').text('Показать еще');
                $iPartnersToggle.children('i').show();
            }

            if (self._state.isMobile) {
                if ($(this).hasClass('opened')) {
                    $iLeadership.find('.page__center').removeClass('opened');
                    $(this).removeClass('opened').children('.button-aurora__text').text('Показать еще');
                    $(this).children('i').show();
                } else {
                    $iLeadership.find('.page__center').addClass('opened');
                    $(this).addClass('opened').children('.button-aurora__text').text('Скрыть');
                    $(this).children('i').hide();
                }
            } else {
                if ($iLeadership.hasClass('opened')) {
                    self._elems.$iScroll.width('');

                    $iLeadership.removeClass('opened');
                    $(this).removeClass('opened').children('.button-aurora__text').text('Показать еще');
                    $(this).children('i').show();

                    if ($(window).width() >= self._elems.$iScroll.children().width()) {
                        $('body').height($(window).width() / self._state.windowRatio * self._elems.$iScroll.children().length);
                    } else {
                        $('body').height(self._elems.$iScroll.width() / self._state.windowRatio);
                    }
                } else {
                    var width = $iLeadershipItem.eq(0).width();
                    var nWidth = (width + 45) * Math.round($iLeadershipItem.length / 2) + 80 - 15 - 1600;
                    self._elems.$iScroll.width(self._elems.$iScroll.width() + nWidth);

                    $iLeadership.addClass('opened');
                    $(this).addClass('opened').children('.button-aurora__text').text('Скрыть');
                    $(this).children('i').hide();

                    if ($(window).width() >= self._elems.$iScroll.children().width()) {
                        $('body').height($(window).width() / self._state.windowRatio * self._elems.$iScroll.children().length);
                    } else {
                        $('body').height(self._elems.$iScroll.width() / self._state.windowRatio);
                    }
                }
            }
        });
    },
    _initPartners: function () {
        var self = this;

        var $iPartners = self._elems.$_.find('.iPartners');
        if ($iPartners.length == 0) return;

        var $iPartnersItem = $iPartners.find('.iPartners__item');
        var $iPartnersToggle = $iPartners.find('.button-aurora');

        var $iLeadership = self._elems.$_.find('.iLeadership');
        var $iLeadershipToggle = $iLeadership.length ? $iLeadership.find('.button-aurora') : $();

        $(window).resize(function () {
            self._elems.$iScroll.width('');

            $iPartners.removeClass('opened');
            $iPartnersToggle.removeClass('opened');
            $iPartnersToggle.children('.button-aurora__text').text('Показать еще');
            $iPartnersToggle.children('i').show();
        });

        $iPartnersToggle.click(function (e) {
            e.preventDefault();

            if ($iLeadership.length && $iLeadershipToggle.length) {
                $iLeadership.removeClass('opened');
                $iLeadershipToggle.removeClass('opened').children('.button-aurora__text').text('Показать еще');
                $iLeadershipToggle.children('i').show();
            }

            if (self._state.isMobile) {
                if ($(this).hasClass('opened')) {
                    $iPartners.find('.page__center').removeClass('opened');
                    $(this).removeClass('opened').children('.button-aurora__text').text('Показать еще');
                    $(this).children('i').show();
                } else {
                    $iPartners.find('.page__center').addClass('opened');
                    $(this).addClass('opened').children('.button-aurora__text').text('Скрыть');
                    $(this).children('i').hide();
                }
            } else {
                if ($iPartners.hasClass('opened')) {
                    self._elems.$iScroll.width('');

                    $iPartners.removeClass('opened');
                    $(this).removeClass('opened').children('.button-aurora__text').text('Показать еще');
                    $(this).children('i').show();

                    if ($(window).width() >= self._elems.$iScroll.children().width()) {
                        $('body').height($(window).width() / self._state.windowRatio * self._elems.$iScroll.children().length);
                    } else {
                        $('body').height(self._elems.$iScroll.width() / self._state.windowRatio);
                    }
                } else {
                    var width = $iPartnersItem.eq(0).width();
                    var nWidth = width * Math.round($iPartnersItem.length / 5) + 80 - 1600;
                    self._elems.$iScroll.width(self._elems.$iScroll.width() + nWidth);

                    $iPartners.addClass('opened');
                    $(this).addClass('opened').children('.button-aurora__text').text('Скрыть');
                    $(this).children('i').hide();

                    if ($(window).width() >= self._elems.$iScroll.children().width()) {
                        $('body').height($(window).width() / self._state.windowRatio * self._elems.$iScroll.children().length);
                    } else {
                        $('body').height(self._elems.$iScroll.width() / self._state.windowRatio);
                    }
                }
            }
        });
    },
    _initHistory: function () {
        var self = this;

        var $iHistory = self._elems.$_.find('.iHistory');
        if ($iHistory.length == 0) return;

        var ruler = $iHistory.find('.iHistory-ruler__line .owl-carousel');
        var events = $iHistory.find('.iHistory-events .owl-carousel');

        if (ruler.length == 0) return;
        if (events.length == 0) return;

        ruler.owlCarousel({
            nav: false,
            dots: false,
            auto: false,
            responsive: {
                576: {
                    items: Math.min(14, ruler.data('count'))
                }
            }
        });

        events.on('initialized.owl.carousel', function(){
            var height = $iHistory.find('.iHistory-events').height();
            $iHistory.find('.iHistory-event').each(function(){
                $(this).css({'max-height': height});
                $(this).children('.iHistory-event__left').niceScroll({
                    cursorborder : '3px solid #d1dae5'
                });
            });
        });

        self._elems.$scroll.on('scroll', {self: self}, function(e){
            $iHistory.find('.iHistory-event').each(function(){
                $(this).children('.iHistory-event__left').getNiceScroll().resize();
            });
        });

        $(window).on('resize', function(){
            var height = $iHistory.find('.iHistory-events').height();
            $iHistory.find('.iHistory-event').each(function(){
                $(this).css({'max-height': height});
                $(this).children('.iHistory-event__left').getNiceScroll().resize();
            });
        });

        events.owlCarousel({
            nav: false,
            dots: false,
            items: 1,
            margin: 15,
            auto: false,
            autoHeight:true,
            responsive: {
                568: {
                    nav: true,
                    autoHeight:false
                }
            }
        });

        $iHistory.find('.iHistory-ruler__item a').click(function (e) {
            e.preventDefault();

            var link = $(this);

            $iHistory.find('.iHistory-ruler__item').removeClass('iHistory-ruler__item--active');
            link.parent().addClass('iHistory-ruler__item--active');
            $iHistory.find('.iHistory-ruler__pipe').css({'right': 'auto'}).animate({'left': link.parents('.owl-item').position().left + link.position().left - 8}, 300);

            events.trigger('to.owl.carousel', link.parents('.owl-item').index() + 1);
        });

        $iHistory.find('.iHistory-ruler__left').click(function (e) {
            e.preventDefault();

            $iHistory.find('.iHistory-ruler__item').removeClass('iHistory-ruler__item--active');
            $iHistory.find('.iHistory-ruler__pipe').css({'right': 'auto'}).animate({'left': -200}, 300);

            events.trigger('to.owl.carousel', 0);
        });

        $iHistory.find('.iHistory-ruler__right').click(function (e) {
            e.preventDefault();

            $iHistory.find('.iHistory-ruler__item').removeClass('iHistory-ruler__item--active');
            $iHistory.find('.iHistory-ruler__pipe').css({'left': 'auto'}).animate({'right': -200}, 300);

            events.trigger('to.owl.carousel', events.find('.owl-item').length - 1);
        });
    },
    _initNav: function () {
        var self = this;

        if (Utils.isMobile()) return;
        var $iNav = self._elems.$_.find('.iNav');
        if ($iNav.length == 0) return;

        $iNav.children('a').click(function (e) {
            e.preventDefault();

            var $target = $($(this).attr('href'));
            if ($target.length == 0) return;

            var scrollLeft = self._elems.$scroll.scrollLeft();
            var scrollTop = Math.round((scrollLeft + $target.offset().left )/ self._state.windowRatio);
            $('html, body').stop().animate({'scrollTop': scrollTop}, 1200);
        });

        setTimeout(function(){
            $iNav.children('a').removeClass('active');
            $iNav.children('a').each(function(){
                var link = $(this);
                if (
                    $(link.attr('href')).length && $(link.attr('href')).offset().left < $(window).width() / 2 && $(link.attr('href')).offset().left > -1 * $(window).width() / 2
                ) {
                    link.addClass('active');

                    if ($(link.attr('href')).find('.iScroll-item__label').length) {
                        $('#wrapper .page__label').stop().text($(link.attr('href')).find('.iScroll-item__label').text());
                    } else {
                        $('#wrapper .page__label').text('О компании');
                    }
                }
            });
        }, 200);
    },
    _handleSliderScroll: function (e) {
        var self = e.data.self;

        var scrollLeft = self._elems.$scroll.scrollLeft();
        var scrollTop = Math.round(scrollLeft / self._state.windowRatio);

        if (Utils.isTouchDevice()) {
            $(window).scrollTop(scrollTop);
        }

        if (Utils.isMobile()) return;

        var img = $('#wrapper .brand-box__image img');
        self._elems.$iScroll.children('.iScroll-item').each(function () {
            if (
                self._elems.$iScroll.data('direction') == 'right' && $(this).offset().left >= 0 && $(this).offset().left < 360
                ||
                self._elems.$iScroll.data('direction') == 'left' && $(this).width() + $(this).offset().left > 200 && $(this).width() + $(this).offset().left < 1600
            ) {
                if ($(this).find('.iScroll-item__label').length) {
                    var item = $(this);
                    $('#wrapper .page__label').stop().text(item.find('.iScroll-item__label').text());
                } else {
                    $('#wrapper .page__label').text('О компании');
                }

                if ($(this).hasClass('iRatings')) {
                    img.attr('src', img.data('white'));
                } else {
                    img.attr('src', img.data('original'));
                }
            }
            if (
                self._elems.$iScroll.data('direction') == 'right' && $(this).offset().left >= 200 && $(this).offset().left < $(window).width()
            ) {
                $(this).addClass('active');
            }
            if (
                $(this).offset().left < $(window).width() / 2 && $(this).offset().left > -1 * $(window).width() / 2
            ) {
                var $iNav = self._elems.$_.find('.iNav');
                if ($iNav.length == 0) return;

                $iNav.children('a').removeClass('active');
                $iNav.children('a[href="#' + $(this).attr('id') + '"]').addClass('active');
            }
        });
    },

    _renderParallaxState: function () {
        var self = this;

        self._elems.$_.find('[data-factor]').each(function () {
            var $parent = $(this).parents('.iScroll-item');
            var offsetLeft = $parent.offset().left;

            if ((offsetLeft < $(window).width() + 100) && (offsetLeft + $parent.width()) > -100) {
                $(this).css({
                    'transform': 'translate3d(' + offsetLeft * $(this).data('factor') + 'px, 0, 0)'
                });
            }
        });

    },

    _handleWindowResize: function (e) {
        var self = e.data.self;

        self._setIsMobile();
        self._resetDesktop();
        self._setWindowRatio();
        self._setBodyHeight();
        self._setScrollWidth();
    },

    _bindUI: function () {
        var self = this;

        if( Utils.isTouchDevice() ) {
            self._elems.$scroll.on('scroll', {self: self}, function(e){
                self._renderParallaxState();
                self._handleSliderScroll(e);
            });
        }
        else {
            self._elems.$scroll.css({'overflow-x': 'hidden'});
            $(window).on('scroll', {self: self}, function (e) {
                if (self._state.isMobile) return;
                if (self._state.isAdminPage) return;

                self._renderParallaxState();
                self._handleSliderScroll(e);

                var scrollLeft = self._elems.$scroll.scrollLeft();
                self._elems.$scroll.scrollLeft($(window).scrollTop() * self._state.windowRatio);
                if (scrollLeft < self._elems.$scroll.scrollLeft()) {
                    self._elems.$iScroll.data('direction', 'right');
                } else {
                    self._elems.$iScroll.data('direction', 'left');
                }

                if ($(window).scrollTop() * self._state.windowRatio > 800) {
                    $('#wrapper').addClass('menu--hide');
                } else {
                    $('#wrapper').removeClass('menu--hide');
                }
            });
        }

        $(window).on('resize', {self: self}, self._handleWindowResize);
    },

    init: function () {
        var self = this;

        var $_ = $('#about-slider');

        if ($_.length == 0) return;

        self._elems.$_ = $_;
        self._elems.$iScroll = $_.find('.iScroll');
        self._elems.$scroll = $_.find('.gantt-slider__scroll');

        self._setIsAdminPage();
        self._setIsMobile();
        self._setWindowRatio();
        self._setBodyHeight();
        self._setScrollWidth();
        self._initGeo();
        self._initDigits();
        self._initLeadership();
        self._initPartners();
        self._initHistory();
        self._initNav();

        self._bindUI();
    }
};