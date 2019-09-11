var Swiper = require("swiper");

module.exports = {
    init: function() {
        const newsSliderContainer = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliderContainer.forEach(function(slider) {
			const mainContentSliderContainer = slider.querySelector('.js-news-slider-container');
			const BGimagesSliderContainer = slider.querySelector('.js-news-bg-images-slider-container');
            
			const BGImageSlider = new Swiper(BGimagesSliderContainer, {
				effect: "fade",
				loop: true
			})

			const mainContentSlider = new Swiper(mainContentSliderContainer, {
                slidesPerView: "auto",
                spaceBetween: 60,
                loop: true,
                breakpoints: {
                    1050: {
                        spaceBetween: 40
                    }
				},
				thumbs: {
					swiper: BGImageSlider
				},
				navigation: {
					nextEl: slider.parentElement.querySelector(
						".js-news-slider-next"
					),
					prevEl: slider.parentElement.querySelector(
						".js-news-slider-prev"
					)
				}
			});


			// mainContentSlider.controller.control = BGImageSlider;
    		// BGImageSlider.controller.control = mainContentSlider;
        });
    }
};
