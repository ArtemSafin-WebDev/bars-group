var Swiper = require("swiper");

module.exports = {
    init: function() {
        const newsSliderContainer = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        newsSliderContainer.forEach(function(slider) {
			const mainContentSliderContainer = slider.querySelector('.js-news-slider-container');
			const mainSliderNext = slider.parentElement.querySelector(
				".js-news-slider-next"
			);
			const mainSliderPrev = slider.parentElement.querySelector(
				".js-news-slider-prev"
			);
			const BGimagesSliderContainer = slider.querySelector('.js-news-bg-images-slider-container');
            
			const BGImageSlider = new Swiper(BGimagesSliderContainer, {
				effect: "fade",
				loop: true,
				allowTouchMove: false
			})

			const mainContentSlider = new Swiper(mainContentSliderContainer, {
                slidesPerView: "auto",
                spaceBetween: 60,
				loop: true,
				slideToClickedSlide: true,
                breakpoints: {
                    1050: {
                        spaceBetween: 40
                    }
				},
				thumbs: {
					swiper: BGImageSlider
				},
				navigation: {
					nextEl: mainSliderNext,
					prevEl: mainSliderPrev
				}
			});


			// mainSliderNext.addEventListener('mouseenter', function() {
			// 	slider.classList.add('images-shown');
			// })
			// mainSliderPrev.addEventListener('mouseenter', function() {
			// 	slider.classList.add('images-shown');
			// })
			// slider.addEventListener('mouseenter', function() {
			// 	slider.classList.add('images-shown');
			// })
			// slider.addEventListener('mouseleave', function() {
			// 	slider.classList.remove('images-shown');
			// })
        });
    }
};
