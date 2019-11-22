var Swiper = require("swiper");

module.exports = {
    init: function() {
        var wasIntegratedSliders = Array.prototype.slice.call(document.querySelectorAll('.js-was-integrated-slider'));


        wasIntegratedSliders.forEach(function(slider) {
            var container = slider.querySelector('.swiper-container');
            new Swiper(container, {
                watchOverflow: true,
                autoHeight: true,
                navigation: {
                    nextEl: slider.querySelector(
                        ".js-integrated-slider--next"
                    ),
                    prevEl: slider.querySelector(
                        ".js-integrated-slider--prev"
                    )
                },
            })
        })
    }
};
