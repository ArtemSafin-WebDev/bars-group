var about = {
    /*** Init Function ***/
    init: function () {
        var self = this;

        self.variables();
        self.attachEvents();
    },
    /*** Variables ***/
    variables: function () {
        var self = this;

        /*** app ***/
        self.document = $(document);
        self.window   = $(window);
        self.body     = $('body');

        self.isMobile = false;
    },
    attachEvents: function(){
        var self = this;

        self.document.ready(function(){
            if(self.window.width() <= 576)
                self.isMobile = true;

            if(!self.isMobile) {
                AboutSlider.init();
            }

            if(self.isMobile)
                self.initGeo();
            else
                $('.iGeo__map img').on('load', function(){
                    self.initGeo();
                });

            if($('.iDigits-slides.owl-carousel') !== undefined && $('.iDigits-slides.owl-carousel').length)
                self.initDigits();

            if($('.iLeadership') !== undefined && $('.iLeadership').length)
                self.initLeadership();

            if($('.iHistory') !== undefined && $('.iHistory').length)
                self.initHistory();
        });

        self.window.resize(function(){
            if(self.window.width() <= 576)
                self.isMobile = true;
            else
                self.isMobile = false;
        });
    },
    initGeo: function(){
        var self = this;
        var offsetTop = self.isMobile ? 200 : 63;

        var height = $('.iGeo__map').height() + offsetTop;
        var width = $('.iGeo__map').width();
        $('.iGeo__items').width(!self.isMobile ? $('.iGeo__map img').width() : '100%');
        $('.iGeo__item').each(function(){
            var top = 0;
            var left = 0;
            if($(this).data('top') > 0)
                top = $(this).data('top') / height * 100;
            if($(this).data('left') > 0)
                left = $(this).data('left') / width * 100 + 0.75;

            if(self.isMobile)
                top = Math.max(0, top - 40);

            $(this).stop().animate({'top': top + '%', 'left': left + '%'}, 1000).addClass($('.iGeo__items').data('active'));
        });
    },
    initDigits: function(){
        var self = this;

        var owlDigits = $('.iDigits-slides.owl-carousel').owlCarousel({
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

        owlDigits.on('changed.owl.carousel', function(event){
            $('.iDigits-values__item').removeClass($('.iDigits-values').data('active'));
            $('.iDigits-values__item').eq(event.item.index).addClass($('.iDigits-values').data('active'));
        });

        $('.iDigits-values__item').eq(0).addClass($('.iDigits-values').data('active'));

        $('.iDigits-values__item').click(function(){
            $('.iDigits-values__item').removeClass($('.iDigits-values').data('active'));

            $(this).addClass($('.iDigits-values').data('active'));

            var index = self.isMobile ? $(this).parent().index() : $(this).index();

            $('.iDigits .owl-carousel').trigger('to.owl.carousel', index);
        });

        if(self.isMobile && $('.iDigits-values.owl-carousel') !== undefined && $('.iDigits-values.owl-carousel').length){
            var owlDigitsValues = $('.iDigits-values.owl-carousel').owlCarousel({
                nav: false,
                dots: false,
                auto: false,
                autoWidth: true
            });
        }
    },
    initLeadership: function(){
        var self = this;

        if($('.iLeadership-item') === undefined || $('.iLeadership-item').length == 0)
            return;

        var height = $('.iLeadership-item').eq(0).height();
        $('.iLeadership-item').width(height*0.8);

        $('.iLeadership .button').click(function(event){
            event.preventDefault();

            if(self.isMobile) {
                if ($(this).hasClass('opened')) {
                    $('.iLeadership .page__center').removeClass('opened');
                    $(this).removeClass('opened').children('.button-default__text').text('Показать еще');
                    $(this).children('i').show();
                } else {
                    $('.iLeadership .page__center').addClass('opened');
                    $(this).addClass('opened').children('.button-default__text').text('Скрыть');
                    $(this).children('i').hide();
                }
            }
        });

        $("#leadershipModal").iziModal({
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            width: 912,
            padding: 45,
            radius: 0,
            overlayClose: false,
            onOpening: function(event){
                var modal = event.$element;
                var left = modal.find('.iLeadership-modal__left');
                var right = modal.find('.iLeadership-modal__right');

                $.ajax({
                    url: 'data/leadership.json',
                    dataType: 'json',
                    beforeSend: function () {
                        modal.addClass('--loading');
                        left.empty();
                        right.empty();
                    },
                    success: function (data) {
                        setTimeout(function(){
                            modal.removeClass('--loading');
                        }, 500);

                        if(data.image)
                            left.append(
                                $('<img />')
                                    .attr('src', data.image)
                            );

                        if(data.name)
                            right.append(
                                $('<p/>')
                                    .addClass('iLeadership-modal__name')
                                    .text(data.name)
                            );

                        if(data.position)
                            right.append(
                                $('<p/>')
                                    .addClass('iLeadership-modal__position')
                                    .text(data.position)
                            );

                        if(data.content.length)
                            data.content.forEach(function (content) {
                                if (content.title)
                                    right.append(
                                        $('<p/>')
                                            .addClass('iLeadership-modal__title')
                                            .text(content.title)
                                    );
                                if (content.text)
                                    right.append(
                                        $('<div/>')
                                            .addClass('iLeadership-modal__text')
                                            .html(content.text)
                                    );
                            });
                    }
                })
            }
        });

        $('#leadershipModal .iziModal-close').click(function(event){
            event.preventDefault();

            $("#leadershipModal").iziModal('close');
        });

        $('.iLeadership-item').click(function(event){
            event.preventDefault();

            $('#leadershipModal').iziModal('open');
        });
    },
    initHistory: function(){
        var self = this;

        var ruler = $('.iHistory-ruler__line .owl-carousel');
        var events = $('.iHistory-events .owl-carousel');

        if(ruler === undefined || ruler.length == 0)
            return;
        if(events === undefined || events.length == 0)
            return;

        var owlRuler = ruler.owlCarousel({
            nav: false,
            dots: false,
            items: Math.min(14, ruler.data('count')),
            auto: false
        });

        var owlEvents = events.owlCarousel({
            nav: false,
            dots: false,
            items: 1,
            auto: false
        });

        $('.iHistory-ruler__item a').click(function(event){
            event.preventDefault();

            $('.iHistory-ruler__item').removeClass('iHistory-ruler__item--active');

            $(this).parent().addClass('iHistory-ruler__item--active');

            events.trigger('to.owl.carousel', $(this).parents('.owl-item').index() + 1);
        });
    }
};

if($('#about-slider') !== undefined && $('#about-slider').length)
    about.init();

var AboutSlider = {

    _GANTT_ITEM_WIDTH: 510,
    _GANTT_SCENE_HEIGHT: 600,
    _GANTT_EDGE_OFFSET: 60,

    _PATTERN_ITEMS: [[310, 60], [25, 355], [200, 775], [370, 1070], [100, 1435], [410, 1760], [120, 2115]],
    _PATTERN_WIDTH: 2440,

    _state: {
        randomItems: [],
        isUserActivityHandled: false,
        isGanttView: false,
        savedSceneHeight: null,
        maxScrollLeft: null,
        lastRangeValue: null
    },

    _initRangeSlider: function () {
        var self = this;

        var $range = $('#about-slider .gantt-slider__range');
        $range.data('position', 0);
        $range.find('input').rangeslider({
            polyfill: false,
            onInit: function () {
                $range.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
            },
            onSlide: function(position, value) {
                if($('.iScroll').data('direction') == 'right'){
                    if(position < $range.data('position'))
                        $('.iScroll').data('direction', 'left');
                }
                else if($('.iScroll').data('direction') == 'left'){
                    if(position > $range.data('position'))
                        $('.iScroll').data('direction', 'right');
                }

                $range.data('position', position);

                self._state.maxScrollLeft = $('#about-slider .iScroll').width() - $('#about-slider .iScroll').width() / $('#about-slider .iScroll').children().length;
                var scrollLeft = self._state.maxScrollLeft / 1000 * value;
                $('#about-slider .gantt-slider__scroll').scrollLeft(scrollLeft);
            }
        });

    },

    _handleSliderScroll: function (e) {
        var self = e.data.self;

        var scrollLeft = $('#about-slider .gantt-slider__scroll').scrollLeft();
        self._state.maxScrollLeft = $('#about-slider .iScroll').width() - $('#about-slider .iScroll').width() / $('#about-slider .iScroll').children().length;
        var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
        $('#about-slider .gantt-slider__range input').val(rangeValue).change();

        var img = $('#wrapper .brand-box__image img');

        console.log($('.iScroll').data('direction'));

        $('.iScroll-item').each(function(){
            if(
                $('.iScroll').data('direction') == 'right' && $(this).offset().left >= 0 && $(this).offset().left < 360
                ||
                $('.iScroll').data('direction') == 'left' && $(this).width() + $(this).offset().left > 200 && $(this).width() + $(this).offset().left < 1600
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

    _bindUI: function () {
        var self = this;

        $('.gantt-slider__scroll').on('scroll', {self: self}, self._handleSliderScroll);
        $(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
    },

    init: function () {
        var self = this;

        if ( $('#about-slider').length == 0 || $(window).width() <= 576) return;

        self._initRangeSlider();
        self._bindUI();

        $('html, body').mousewheel(function(e, delta) {
            var scrollLeft = $('#about-slider .gantt-slider__scroll').scrollLeft();
            scrollLeft     = scrollLeft - 150 * delta;
            console.log(delta);
            $('#about-slider .gantt-slider__scroll').stop().animate({scrollLeft: scrollLeft}, 100, 'easeOutQuint');
        });
    }
};