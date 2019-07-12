var NewsSlider = {
    init: function() {
        var newsSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliders.forEach(function(item) {
            new Swiper(item, {
                slidesPerView: "auto",
                spaceBetween: 25,
                navigation: {
                    nextEl: document.querySelector(".js-news-slider--next"),
                    prevEl: document.querySelector(".js-news-slider--prev")
                }
            });
        });
    }
};
