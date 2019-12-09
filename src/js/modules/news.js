var Swiper = require("swiper");

module.exports = {
    init: function() {
        const newsSliderContainer = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliderContainer.forEach(function(slider) {
            const mainContentSliderContainer = slider.querySelector(
                ".js-news-slider-container"
            );
            const mainSliderNext = slider.parentElement.querySelector(
                ".js-news-slider-next"
            );
            const mainSliderPrev = slider.parentElement.querySelector(
                ".js-news-slider-prev"
            );

            new Swiper(mainContentSliderContainer, {
                slidesPerView: "auto",
                loop: false,
                navigation: {
                    nextEl: mainSliderNext,
                    prevEl: mainSliderPrev
                }
            });
        });
    }
};
