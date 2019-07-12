var NewsPhotoSlider = {
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
            var thumbSlider;

            if (thumbnails) {
                thumbContainer = thumbnails.querySelector(".swiper-container");
            }

            if (thumbContainer) {
                thumbSlider = new Swiper(thumbContainer, {
                    slidesPerView: "auto",
                    spaceBetween: 15,
                    watchSlidesVisibility: true,
                    watchSlidesProgress: true,
                    slideToClickedSlide: true,
                    on: {
                        reachEnd: function() {
                            thumbnails.classList.remove("gradient-shown");
                        }
                    }
                });
            }

            if (container) {
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
                        swiper: thumbSlider
                    }
                });
            }
        });
    }
};
