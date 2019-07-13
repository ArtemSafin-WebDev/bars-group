var NewsSlider = {
    init: function() {
        var newsSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-news-slider")
        );

        function checkIfFullyVisible(element) {
            var viewportOffsetLeft = element.getBoundingClientRect().left;
            // var viewportOffsetRight = element.getBoundingClientRect().right;
            var elementWidth = element.offsetWidth;
            var viewportWidth = document.documentElement.clientWidth;

            // console.log("viewportOffset", viewportOffset);
            // console.log("elementWidth", elementWidth);
            // console.log("viewportWidth", viewportWidth);
            console.log('Checking visibility')

            if (viewportOffsetLeft + elementWidth > viewportWidth || viewportOffsetLeft < 0) {
                return false;
            } else {
                return true;
            }
        }

        function handleSlideVisibility() {
            var slider = this;
            var slides = Array.prototype.slice.call(slider.slides);

            slides.forEach(function(slide) {
                var slideFullyVisible = checkIfFullyVisible(slide);
                if (!slideFullyVisible) {
                    slide.classList.add("not-visible");
                } else {
                    slide.classList.remove("not-visible");
                }
            });
        }

        window.checkVisible = checkIfFullyVisible;

        newsSliders.forEach(function(item) {
            var slider = new Swiper(item, {
                slidesPerView: "auto",
                spaceBetween: 25,
                navigation: {
                    nextEl: document.querySelector(".js-news-slider--next"),
                    prevEl: document.querySelector(".js-news-slider--prev")
                },
                on: {
                    init: handleSlideVisibility,
                    slideChange: handleSlideVisibility,
                    transitionEnd: handleSlideVisibility,
                    resize: handleSlideVisibility,
                    sliderMove: handleSlideVisibility
                }
            });

            
        });
    }
};
