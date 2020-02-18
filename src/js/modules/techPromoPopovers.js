module.exports = {
  init: function() {
    const popovers = Array.prototype.slice.call(
      document.querySelectorAll(".js-tech-popovers")
    );

    popovers.forEach(element => {
      console.log(element);
      const buttons = Array.prototype.slice.call(
        element.querySelectorAll(".tech-promo__platform-link")
      );
      const items = Array.prototype.slice.call(
        element.querySelectorAll(".tech-promo__popovers-item")
      );
      const closeBtns = Array.prototype.slice.call(
        element.querySelectorAll(".tech-promo__popovers-close-btn")
      );

      buttons.forEach(button => {
        button.addEventListener("click", function(event) {
         
          if (event.currentTarget.classList.contains('active')) return;
          buttons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const popover = button.querySelector(".tech-promo__popovers-item");
          if (popover) {
            items.forEach(element => {
              if (element !== popover) {
                element.classList.remove("active");
              } else {
                element.classList.add("active");
              }
            });
          }
          document.body.classList.add("tech-promo-no-hover");
        });
      });

      closeBtns.forEach(button => {
        button.addEventListener("click", function(event) {
          event.preventDefault();
          items.forEach(item => item.classList.remove("active"));
          document.body.classList.remove("tech-promo-no-hover");
        });
      });


      document.addEventListener('click', function(event) {
        const insidePopover = event.target.closest(".tech-promo__popovers-item") || event.target.matches(".tech-promo__popovers-item");
        const onButton = event.target.closest(".tech-promo__platform-link") || event.target.matches(".tech-promo__platform-link");

        const isOutsideClick = !insidePopover && !onButton;
        if (isOutsideClick) {
            items.forEach(item => item.classList.remove("active"));
            document.body.classList.remove("tech-promo-no-hover");
        }
      });

     

      // function outsideClickHandler(event) {
      //     const insideClick =
      //         (event.target.closest(".tech-promo__platform-link") ||
      //         event.target.matches(".tech-promo__platform-link")) || (event.target.closest(".tech-promo__popovers-item") ||
      //         event.target.matches(".tech-promo__popovers-item"));

      //     if (insideClick) return;
      //     items.forEach(item => item.classList.remove("active"));
      //     document.body.classList.remove('tech-promo-no-hover');
      //     console.log("Closing");
      // }

    

      // document.addEventListener("click", outsideClickHandler);
    });
  }
};
