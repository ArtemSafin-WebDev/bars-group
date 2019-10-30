var PerfectScrollbar = require("perfect-scrollbar");
var ScrollBooster = require("scrollbooster");

function initialize(block) {
  console.log("Running initialize");

  const elements = {
    slidesWrapper: null,
    slides: [],
    navigationLinks: []
  };

  const SCROLLBAR_OPTIONS = {
    wheelPropagation: true,
    maxScrollbarLength: 72
  };

  const SCROLLING_OFFSET = 70;
  const SCROLLING_STEP = 50;

  let state = {
    customScrollbar: null,
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
  }

  function setCustomScrollbar(element) {
    console.log("Setting custom scrollbar");
    const ps = new PerfectScrollbar(element, SCROLLBAR_OPTIONS);
    setState({
      customScrollbar: ps
    });
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
    const logo = document.querySelector(".brand-box");
    elements.slidesWrapper.addEventListener("ps-scroll-x", function() {
      if (state.customScrollbar.reach.x === "start") {
        logo.classList.remove("hidden-by-scroll");
      } else {
        logo.classList.add("hidden-by-scroll");
      }
    });
  }

  function addScrollAnimations() {
    const controller = new ScrollMagic.Controller({
      vertical: false,
      addIndicators: false
    });
    const advantagesSlide = document.querySelector("#advantages");

    if (advantagesSlide) {
      const cards = Array.prototype.slice.call(
        advantagesSlide.querySelectorAll(".new-about__advantages-card")
      );

      cards.forEach(card => {
        const timeline = new TimelineMax();

        timeline.from(card, 2, {
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
    if (event.deltaY > 0) {
      elements.slidesWrapper.scrollLeft += SCROLLING_STEP;
    } else {
      elements.slidesWrapper.scrollLeft -= SCROLLING_STEP;
    }

    if (elements.slidesWrapper.scrollLeft + elements.slidesWrapper.offsetWidth >= elements.slidesWrapper.scrollWidth) {
        return;
    } else {
        event.preventDefault();
    }
  }

  function addDragScroll(element) {
    // let viewport = elements.slidesWrapper;

    // let sb = new ScrollBooster({
    //   viewport,

    //   mode: "x",
    //   onUpdate: data => {
    //     viewport.scrollLeft = data.position.x;
    //   }
    // });

    let drag = false;
    let startX = 0;
    let deltaX = 0;

    const mouseDown = event => {
      if (
        event.target &&
        (event.target.nodeName === "IMG" || event.target.nodeName === "A")
      ) {
        event.preventDefault();
      }
      startX = event.clientX + element.scrollLeft;
      deltaX = 0;
      drag = true;
    };
    const mouseMove = event => {
      if (!drag) return;
      deltaX = startX - (event.clientX + element.scrollLeft);
      element.scrollLeft += deltaX;
    };

    const mouseUp = () => {
      drag = false;
    };

    element.addEventListener("mousedown", mouseDown);
    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseup", mouseUp);
  }

  function setState(newState) {
    const oldState = state;
    state = {
      ...oldState,
      ...newState
    };
  }

  function addListeners() {
    elements.navigationLinks.forEach((link, index) => {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        setActiveSlide(index);
        setActiveLink(index);
        scrollWrapperTo(index);
        console.log(getSlideName(index));
      });
    });

    elements.slidesWrapper.addEventListener("wheel", handleMouseWheel);
  }

  function main() {
    getElements();
    setCustomScrollbar(elements.slidesWrapper);
    addDragScroll(elements.slidesWrapper);
    addListeners();
    addLogoHandling();
    addScrollAnimations();
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
