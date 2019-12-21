var PerfectScrollbar = require("perfect-scrollbar");
var Swiper = require("swiper");
var detectIt = require("detect-it");


function initialize(block) {
    if (document.body.classList.contains('is-admin')) {
        return;
    }


    console.log("Running initialize");

    let sliderActive = false;

    // let drag = false;
    // let startX = 0;
    // let deltaX = 0;

    const elements = {
        slidesWrapper: null,
        slides: [],
        navigationLinks: [],
        logo: null
    };

    const SCROLLBAR_OPTIONS = {
        wheelPropagation: true,
        maxScrollbarLength: 72,
        suppressScrollY: true
    };

    const SCROLLING_OFFSET = 70;

    let state = {
        customScrollbar: null,
        scrollMagicController: null,
        activeSlide: 0
    };

    function getElements() {
        elements.slidesWrapper = block.querySelector(
            ".js-new-about-slides-container"
        );
        if (!elements.slidesWrapper) throw new Error("No slider wrapper found");
        elements.slides = Array.prototype.slice.call(
            elements.slidesWrapper.children
        );
        if (elements.slides.length === 0) throw new Error("No slides present");
        elements.navigationLinks = Array.prototype.slice.call(
            block.querySelectorAll(":scope .js-new-about-navigation a")
        );
        elements.logo = document.querySelector(".brand-box");
        if (!elements.logo) throw new Error("No logo element present");
    }

    function setCustomScrollbar(element) {
        console.log("Setting custom scrollbar");


        
        if (detectIt.hasTouch) return;
        const ps = new PerfectScrollbar(element, SCROLLBAR_OPTIONS);
        setState({
            customScrollbar: ps
        });
    }

    function removeCustomScrollbar() {
        if (state.customScrollbar) {
            state.customScrollbar.destroy();
            setState({
                customScrollbar: null
            });
        }
    }

    function getSlideName(index) {
        const link = elements.navigationLinks[index];
        if (!link) {
            console.warn("Could not get slide name from link");
            return;
        }
        return link.textContent;
    }

    function setActiveSlide(index) {
        setState({
            activeSlide: index
        });
    }

    function setActiveLink(index) {
        elements.navigationLinks.forEach(element =>
            element.classList.remove("active")
        );
        const activeLink = elements.navigationLinks[index];
        if (!activeLink) {
            console.warn("No link with such index");
            return;
        } else {
            activeLink.classList.add("active");
        }
    }

    function addLogoHandling() {
        if (!state.customScrollbar) return;
        elements.slidesWrapper.addEventListener(
            "ps-scroll-x",
            logoScrollHandler
        );
    }

    function logoScrollHandler() {
        if (state.customScrollbar.reach.x === "start") {
            elements.logo.classList.remove("hidden-by-scroll");
        } else {
            elements.logo.classList.add("hidden-by-scroll");
        }
    }

    function removeLogoHandling() {
        elements.slidesWrapper.removeEventListener(
            "ps-scroll-x",
            logoScrollHandler
        );
    }

    function initializeNumbersSlider() {
        const newAboutNumbers = Array.prototype.slice.call(
            document.querySelectorAll(".js-new-about-numbers")
        );
        newAboutNumbers.forEach(block => {
            const mainContainer = block.querySelector(
                ".new-about__numbers-main-slider .swiper-container"
            );
            const thumbsContainer = block.querySelector(
                ".new-about__numbers-thumbs-slider .swiper-container"
            );
            const mainOptions = {
                spaceBetween: 30,
                allowTouchMove: false,
                navigation: {
                    prevEl: block.querySelector(
                        ".new-about__slider-nav__button--prev"
                    ),
                    nextEl: block.querySelector(
                        ".new-about__slider-nav__button--next"
                    )
                },
                thumbs: {}
            };
            const thumbsOptions = {
                slidesPerView: 'auto',
                threshold: 10,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                slideToClickedSlide: true,
               
            };

            mainOptions.thumbs.swiper = new Swiper(
                thumbsContainer,
                thumbsOptions
            );
            new Swiper(mainContainer, mainOptions);
        });
    }


    function initializeHistorySlider() {
        const newAboutHistorySliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-new-about-history")
        );
        newAboutHistorySliders.forEach(element => {
            const mainContainer = element.querySelector(
                ".new-about__history-main-slider .swiper-container"
            );
            const thumbsContainer = element.querySelector(
                ".new-about__history-thumbs-slider .swiper-container"
            );
            const mainOptions = {
                thumbs: {},
                effect: "fade",
                allowTouchMove: false,
                fadeEffect: {
                    crossFade: true
                },
                autoHeight: true,
                navigation: {
                    nextEl: element.querySelector(
                        ".new-about__history-main-slider-bottom-arrow button"
                    ),
                    prevEl: element.querySelector(
                        ".new-about__history-main-slider-top-arrow button"
                    )
                },
            };
            const thumbsOptions = {
                slidesPerView: 'auto',
                spaceBetween: 10,
                threshold: 10,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                slideToClickedSlide: true,
                direction: window.matchMedia("(min-width: 801px)").matches
                    ? "vertical"
                    : "horizontal"
            };

            mainOptions.thumbs.swiper = new Swiper(
                thumbsContainer,
                thumbsOptions
            );
            new Swiper(mainContainer, mainOptions);
        });
    }

    function addScrollAnimations() {
        const controller = new ScrollMagic.Controller({
            vertical: false,
            addIndicators: false
        });

        const homeSlide = document.querySelector("#home");

        if (homeSlide) {
            const pattern = document.querySelector('.new-about__home-pattern');
            const timeline = new TimelineMax();


            timeline.to(pattern, 1, {
                xPercent: "60%",
                ease: Power0.easeNone
            });
         
            new ScrollMagic.Scene({
                triggerElement: homeSlide,
                triggerHook: 1,
                duration: "200%"
            })
                .setTween(timeline)
                .addTo(controller);
        }



        const advantagesSlide = document.querySelector("#advantages");

        if (advantagesSlide) {
            const cards = Array.prototype.slice.call(
                advantagesSlide.querySelectorAll(".new-about__advantages-card")
            );

            cards.forEach(card => {
                const timeline = new TimelineMax();

                timeline.from(card, 2, {
                    autoAlpha: 0,
                    scale: 0,
                    ease: Power4.easeOut
                });

                new ScrollMagic.Scene({
                    triggerElement: card,
                    triggerHook: 1,
                    reverse: false
                })
                    .setTween(timeline)
                    .addTo(controller);
            });
        }

        const ratingsSlide = document.querySelector("#ratings");

        if (ratingsSlide) {
            const cards = Array.prototype.slice.call(
                ratingsSlide.querySelectorAll(".new-about__ratings-card")
            );

            cards.forEach(card => {
                const timeline = new TimelineMax();

                timeline.from(card, 0.5, {
                    autoAlpha: 0,
                    scale: 0,
                    ease: Power4.easeOut
                });

                new ScrollMagic.Scene({
                    triggerElement: card,
                    triggerHook: 1,
                    reverse: false
                })
                    .setTween(timeline)
                    .addTo(controller);
            });
        }

        const topsSlide = document.querySelector("#tops");

        if (topsSlide) {
            const cards = Array.prototype.slice.call(
                topsSlide.querySelectorAll(".new-about__tops-card")
            );

            cards.forEach(card => {
                const timeline = new TimelineMax();

                timeline.from(card, 0.8, {
                    autoAlpha: 0
                });

                new ScrollMagic.Scene({
                    triggerElement: card,
                    triggerHook: 1,
                    reverse: false
                })
                    .setTween(timeline)
                    .addTo(controller);
            });


            const pattern = document.querySelector('.new-about__tops-pattern');
            const timeline = new TimelineMax();


            timeline.to(pattern, 1, {
                x: "40%",
                ease: Power0.easeNone
            });

            new ScrollMagic.Scene({
                triggerElement: topsSlide,
                triggerHook: 1,
                duration: "200%"
            })
                .setTween(timeline)
                .addTo(controller);
        }

        const missionSlide = document.querySelector("#mission");

        if (missionSlide) {
            const parallax = Array.prototype.slice.call(
                missionSlide.querySelectorAll("[data-parallax]")
            );

            parallax.forEach(element => {
                const timeline = new TimelineMax();

                timeline.to(element, 1, {
                    x: "-30%",
                    ease: Power0.easeNone
                });

                new ScrollMagic.Scene({
                    triggerElement: missionSlide,
                    triggerHook: 1,
                    duration: "200%"
                })
                    .setTween(timeline)
                    .addTo(controller);
            });
        }

        const geographySlide = document.querySelector("#geography");

        if (geographySlide) {
            const parallax = Array.prototype.slice.call(
                geographySlide.querySelectorAll("[data-parallax]")
            );

            parallax.forEach(element => {
                const timeline = new TimelineMax();

                timeline.to(element, 1, {
                    x: `-${element.getAttribute("data-parallax")}%`,
                    ease: Power0.easeNone
                });

                new ScrollMagic.Scene({
                    triggerElement: geographySlide,
                    triggerHook: 1,
                    duration: "120%"
                })
                    .setTween(timeline)
                    .addTo(controller);
            });
        }

        state.scrollMagicController = controller;
    }

    function removeScrollAnimations() {
        if (state.scrollMagicController) {
            state.scrollMagicController.destroy();
            state.scrollMagicController = null;
        }
    }

    function scrollWrapperTo(index) {
        const element = elements.slides[index];
        if (!element) {
            console.warn("No element to go");
            return;
        }

        elements.slidesWrapper.scrollTo({
            left: element.offsetLeft - SCROLLING_OFFSET,
            behavior: "smooth"
        });
    }

    function handleMouseWheel(event) {
        event.preventDefault();
        elements.slidesWrapper.scrollLeft += event.deltaY;
    }

    // function mouseDown(event) {
    //     if (
    //         event.target &&
    //         (event.target.nodeName === "IMG" || event.target.nodeName === "A")
    //     ) {
    //         event.preventDefault();
    //     }
    //     startX = event.clientX + elements.slidesWrapper.scrollLeft;
    //     deltaX = 0;
    //     drag = true;
    // }
    // function mouseMove(event) {
    //     if (!drag) return;
    //     deltaX = startX - (event.clientX + elements.slidesWrapper.scrollLeft);
    //     elements.slidesWrapper.scrollLeft += deltaX;
    // }

    // function mouseUp() {
    //     drag = false;
    // }

    // function addDragScroll(element) {
    //     element.addEventListener("mousedown", mouseDown);
    //     element.addEventListener("mousemove", mouseMove);
    //     element.addEventListener("mouseup", mouseUp);
    // }
    // function removeDragScroll(element) {
    //     element.removeEventListener("mousedown", mouseDown);
    //     element.removeEventListener("mousemove", mouseMove);
    //     element.removeEventListener("mouseup", mouseUp);
    // }

    function setState(newState) {
        const oldState = state;
        state = {
            ...oldState,
            ...newState
        };
    }

    function navigationLinkHandler(event) {
        event.preventDefault();
        const index = elements.navigationLinks.findIndex(
            element => element === this
        );

        setActiveSlide(index);
        setActiveLink(index);
        scrollWrapperTo(index);
        console.log(getSlideName(index));
    }

    function addListeners() {
        elements.navigationLinks.forEach(link => {
            link.addEventListener("click", navigationLinkHandler);
        });

        elements.slidesWrapper.addEventListener("wheel", handleMouseWheel);
    }

    function removeListeners() {
        elements.navigationLinks.forEach(link => {
            link.addEventListener("click", navigationLinkHandler);
        });

        elements.slidesWrapper.removeEventListener("wheel", handleMouseWheel);
    }

    function sliders() {
        initializeNumbersSlider();
        initializeHistorySlider();
    }

    function init() {
        getElements();
        setCustomScrollbar(elements.slidesWrapper);
        // addDragScroll(elements.slidesWrapper);
        addListeners();
        addLogoHandling();
        addScrollAnimations();
    }

    function destroy() {
        removeCustomScrollbar();
        // removeDragScroll(elements.slidesWrapper);
        removeListeners();
        removeLogoHandling();
        removeScrollAnimations();
    }

    function main() {
        function mountSlider() {
            if (!sliderActive) {
                init();
                sliderActive = true;
            }
        }

        function unmountSlider() {
            if (sliderActive) {
                destroy();
                sliderActive = false;
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

        sliders();
    }

    main();
}

module.exports = {
    init: function() {
        const newAboutSliders = Array.prototype.slice.call(
            document.querySelectorAll(".js-new-about-slider")
        );
        newAboutSliders.forEach(block => {
            initialize(block);
        });
    }
};
