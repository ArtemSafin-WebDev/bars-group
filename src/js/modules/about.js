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

            if(!self.isMobile)
                AboutSlider.init();

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

    _makeScrollCalcs: function () {
        var self = this;

        var $scroll = $('#about-slider .gantt-slider__scroll');
        var $lines  = $('#about-slider .gantt-slider__line');
        var lineOffset = $lines.offset().left + $scroll.scrollLeft();

        if (self._state.isGanttView) {

            // 1. set grid width equal to last item right edge + edge offset
            var lastItemOffset = self._getGanttItemLeftPos(self._state.randomItems.length - 1);
            var gridWidth = lastItemOffset - lineOffset + self._GANTT_ITEM_WIDTH + self._GANTT_EDGE_OFFSET;

            // 2. calc maxScrollLeft
            var maxScrollLeft = gridWidth + lineOffset - $(window).width();

        } else {

            // 1. set grid width equal to max line width
            var maxWidth = 0;

            $lines.each(function () {
                var $lastItem = $(this).find('.gantt-slider__item').last();
                var lineWidth = $lastItem.offset().left - lineOffset + $lastItem.width();
                maxWidth = Math.max(maxWidth, lineWidth);
            });

            var gridWidth = maxWidth;

            // 2. calc maxScrollLeft
            var lastItemMargin = parseInt($('#about-slider .gantt-slider__item').last().css('margin-right'));
            var maxScrollLeft = gridWidth + lineOffset  + lastItemMargin - $(window).width();
        }

        $('#about-slider .gantt-slider__grid').width(gridWidth);

        if (maxScrollLeft < 0) maxScrollLeft = 0;
        self._state.maxScrollLeft = maxScrollLeft;

    },

    _initRangeSlider: function () {
        var self = this;

        var $range = $('#about-slider .gantt-slider__range');
        $range.find('input').rangeslider({
            polyfill: false,
            onInit: function () {
                $range.find('.rangeslider__handle').html('<i></i><i></i><i></i>');
            },
            onSlide: function(position, value) {
                if (value == self._state.lastRangeValue) return;
                self._state.lastRangeValue = value;

                var isHandleActive = $range.find('.rangeslider').hasClass('rangeslider--active');
                if (!isHandleActive) return;

                self._state.maxScrollLeft = $('#about-slider .iScroll').width() - $('#about-slider .iScroll').width() / $('#about-slider .iScroll').children().length;
                var scrollLeft = self._state.maxScrollLeft / 1000 * value;
                $('#about-slider .gantt-slider__scroll').scrollLeft(scrollLeft);
            }
        });

    },

    _startVideoLoading: function () {
        var self = this;

        $('#gantt-slider video').each(function () {
            $(this)[0].load();
        });
    },

    _handleUserActivity: function (e) {
        var self = e.data.self;

        if ( self._state.isUserActivityHandled ) return;
        if ( !Modernizr.video || Modernizr.lowbandwidth ) return;

        self._state.isUserActivityHandled = true;
        setTimeout(self._startVideoLoading.bind(self), 100);
    },

    _handleCanPlayEvent: function (e) {
        var self = e.data.self;

        objectFitPolyfill(this);
        $(this).addClass('_active');
    },

    _handleMouseOver: function (e) {
        var self = e.data.self;

        var $video = $(this).find('video._active');
        if ($video.length) {
            $video[0].play();
        }
    },

    _handleMouseOut: function (e) {
        var self = e.data.self;

        var $video = $(this).find('video._active');
        if ($video.length) {
            $video[0].pause();
        }
    },

    _handleWindowResize: function (e) {
        var self = e.data.self;

        self._makeScrollCalcs();
    },

    _handleSliderScroll: function (e) {
        var self = e.data.self;

        var scrollLeft = $('#gantt-slider .gantt-slider__scroll').scrollLeft();
        var rangeValue = Math.round(1000 * scrollLeft / self._state.maxScrollLeft);
        $('#gantt-slider .gantt-slider__range input').val(rangeValue).change();
    },

    _handleToggleButton: function (e) {
        var self = e.data.self;

        if (self._state.isGanttView) {
            self._switchToLinesView();
        } else {
            self._switchToGanttView();
        }
    },

    _bindUI: function () {
        var self = this;

        $('.gantt-slider__scroll').on('scroll', {self: self}, self._handleSliderScroll);
        $('.gantt-slider__bg__video').on('canplaythrough', {self: self}, self._handleCanPlayEvent);
        $(document).one('click touchstart', {self: self}, self._handleUserActivity);
        $(document).on('mouseover', '.gantt-slider__item', {self: self}, self._handleMouseOver);
        $(document).on('mouseout', '.gantt-slider__item', {self: self}, self._handleMouseOut);
        $(document).on('click', '.gantt-slider__toggle', {self: self}, self._handleToggleButton);
        $(window).on('resize orientationchange', {self: self}, self._handleWindowResize);
    },

    init: function () {
        var self = this;

        if ( $('#about-slider').length == 0 || $(window).width() <= 576) return;

        self._initRangeSlider();

        $('body').trigger('click');
    }
};