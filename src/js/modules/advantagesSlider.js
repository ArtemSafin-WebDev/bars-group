var Swiper = require("swiper");

module.exports = {
    init: function() {
        var advantagesSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-advantages-slider")
        );

        advantagesSliders.forEach(item => {
            var sliderInstance;
            var container = item.querySelector(".swiper-container");

            var widthChange = function(mq) {
                if (mq.matches) {
                    if (sliderInstance) {
                        sliderInstance.destroy();
                    }
                } else {
                    sliderInstance = new Swiper(container, {
                        slidesPerView: 3,
                        spaceBetween: 50,
                        watchOverflow: true,
                        navigation: {
                            nextEl: item.querySelector(
                                ".js-advantages-slider-next"
                            ),
                            prevEl: item.querySelector(
                                ".js-advantages-slider-prev"
                            )
                        },
                        breakpoints: {
                            1200: {
                                slidesPerView: 2,
                                spaceBetween: 50
                            }
                        }
                    });
                }
            };

            if (matchMedia) {
                var mq = window.matchMedia(`(max-width: 800px)`);
                mq.addListener(widthChange);
                widthChange(mq);
            }
        });
    }
};
