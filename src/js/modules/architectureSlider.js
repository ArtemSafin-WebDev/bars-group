var Swiper = require("swiper");

module.exports = {
    init: function() {
        const archSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-architecture__slider")
        );

        archSliders.forEach(element => {
            const container = element.querySelector(".swiper-container");
            const layers = Array.prototype.slice.call(
                element.querySelector(".architecture__images").children
            );

            let slider = null;

            const handleLayers = () => {
                layers.forEach((layer, layerIndex) => {
                    if (layerIndex === slider.activeIndex) {
                        layer.classList.add("active");
                    } else {
                        layer.classList.remove("active");
                    }

                    if (layerIndex <= slider.activeIndex) {
                        layer.classList.add("visible");
                    } else {
                        layer.classList.remove("visible");
                    }
                });
            };

            function mountSlider() {
                if (!slider) {
                    slider = new Swiper(container, {
                        watchOverflow: true,
                        effect: "fade",
                        fadeEffect: {
                            crossFade: true
                        },
                        autoHeight: true,
                        navigation: {
                            nextEl: element.querySelector(
                                ".architecture__slider-down-arrow button"
                            ),
                            prevEl: element.querySelector(
                                ".architecture__slider-top-arrow button"
                            )
                        },
                        init: false
                    });

                    slider.on("init", handleLayers);

                    slider.on("slideChange", handleLayers);

                    slider.init();
                }
            }

            function unmountSlider() {
                if (slider) {
                    slider.destroy();
                    slider = null;
                }
            }

            const widthChange = mq => {
                if (!mq.matches) {
                    mountSlider();
                } else {
                    unmountSlider();
                }
            };

            if (matchMedia) {
                const mq = window.matchMedia(`(max-width: 800px)`);
                mq.addListener(widthChange);
                widthChange(mq);
            }
        });
    }
};
