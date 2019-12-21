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
                    event.preventDefault();
                    const popover = button.querySelector(
                        ".tech-promo__popovers-item"
                    );

                    if (popover) {
                        if (popover.classList.contains('active')) {
                            popover.classList.remove('active');
                            document.body.classList.remove('tech-promo-no-hover');
                            return;
                        }
                        items.forEach(item => item.classList.remove("active"));
                        popover.classList.add("active");
                        document.body.classList.add('tech-promo-no-hover');

                        console.log("Opening");
                    }
                });
            });

            function outsideClickHandler(event) {
                const insideLink =
                    event.target.closest(".tech-promo__platform-link") ||
                    event.target.matches(".tech-promo__platform-link");

                if (insideLink) return;
                items.forEach(item => item.classList.remove("active"));
                document.body.classList.remove('tech-promo-no-hover');
                console.log("Closing");
            }

            closeBtns.forEach(btn => {
                btn.addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    items.forEach(item => item.classList.remove("active"));
                    document.body.classList.remove('tech-promo-no-hover');
                });
            });

            document.addEventListener("click", outsideClickHandler);
        });
    }
};
