var Swiper = require('swiper');

module.exports = {
    init: function() {
        var newsSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliders.forEach(function(item) {
           
            var sliderInstance = new Swiper(item, {
                slidesPerView: "auto",
                navigation: {
                    nextEl: document.querySelector(".js-news-slider--next"),
                    prevEl: document.querySelector(".js-news-slider--prev")
                },
                init: false
            });

            sliderInstance.init();
            
        });
    }
};
