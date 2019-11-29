var Swiper = require("swiper");

module.exports = {
    init: function() {
        if (document.body.classList.contains("is-admin")) {
            return;
        }

        var advantagesSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-new-advantages-slider")
        );

        advantagesSliders.forEach(item => {
            let sliderInstance = null;
            const container = item.querySelector(".swiper-container");
            const options = {
                slidesPerView: 3,
                slidesPerGroup: 3,
                slidesPerColumn: 2,
                spaceBetween: 50,
                watchOverflow: true,
                navigation: {
                    nextEl: item.querySelector(
                        ".js-new-advantages-slider--next"
                    ),
                    prevEl: item.querySelector(
                        ".js-new-advantages-slider--prev"
                    )
                },
                breakpoints: {
                    1300: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 40
                    },
                    800: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                        slidesPerColumn: 1
                    }
                }
            }

            sliderInstance = new Swiper(container, options);

            const widthChange = function(mq) {
                if (sliderInstance) {
                    sliderInstance.destroy();
                    sliderInstance = new Swiper(container, options);
                }
            };

            if (matchMedia) {
                const mq = window.matchMedia(`(max-width: 800px)`);
                mq.addListener(widthChange);
                widthChange(mq);
            }
            if (matchMedia) {
                const mq = window.matchMedia(`(max-width: 1300px)`);
                mq.addListener(widthChange);
                widthChange(mq);
            }
        });
    }
};
