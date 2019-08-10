var Swiper = require('swiper');

module.exports = {
    
    init: function() {
        var photoSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-details-photo-slider")
        );

        photoSliders.forEach(function(item) {
            var thumbnails = item.querySelector(
                ".js-news-details-thumbnails-slider"
            );
            var container = item.querySelector(".swiper-container");
            var thumbContainer;
            if (thumbnails) {
                thumbContainer = thumbnails.querySelector(".swiper-container");
            }

            if (container && thumbContainer) {
                new Swiper(container, {
                    effect: "fade",
                    speed: 600,
                    fadeEffect: { crossFade: true },
                    navigation: {
                        nextEl: document.querySelector(
                            ".news-details__photo-slider-next"
                        ),
                        prevEl: document.querySelector(
                            ".news-details__photo-slider-prev"
                        )
                    },
                    thumbs: {
                        swiper: new Swiper(thumbContainer, {
                            slidesPerView: 9,
                            spaceBetween: 15,
                            threshold: 10,
                            // slideToClickedSlide: true,
                            watchSlidesVisibility: true,
                            watchSlidesProgress: true,
                            on: {
                                progress: function() {
                                    if (this.isBeginning) {
                                        thumbnails.classList.remove(
                                            "gradient-left"
                                        );
                                    } else if (this.isEnd) {
                                        thumbnails.classList.remove(
                                            "gradient-right"
                                        );
                                    } else {
                                        thumbnails.classList.add(
                                            "gradient-left"
                                        );
                                        thumbnails.classList.add(
                                            "gradient-right"
                                        );
                                    }
                                }
                            },
                            breakpoints: {
                                
                                460: {
                                    slidesPerView: 4,
                                    spaceBetween: 10,
                                },
                                
                                600: {
                                    slidesPerView: 6,
                                    spaceBetween: 10,
                                },
                                800: {
                                    slidesPerView: 7,
                                    spaceBetween: 15,
                                }
                            }
                        })
                    }
                });
            }
        });
    }
};
