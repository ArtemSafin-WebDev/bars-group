var NewsToggles = {
    init: function() {
        function setupHandlers(element) {
            if (element) {
                var elementContainer = element.parentElement;
                var elementContent = element.nextElementSibling;
                if (!elementContent)
                    throw new Error(
                        "Отсутствует блок контента виджета соседней новости"
                    );
                var elementOpen = false;
                function outsideClickHandler(event) {
                    if (
                        !elementContainer.contains(event.target) &&
                        event.target !== elementContainer
                    ) {
                        hideElement();
                    }
                }
                function openElement(event) {
                    if (event) event.preventDefault();
                    if (!elementOpen) {
                        elementContainer.classList.add("active");
                        elementOpen = true;
                        document.addEventListener("click", outsideClickHandler);
                        elementContent.addEventListener(
                            "mouseleave",
                            contentMouseLeaveHandler
                        );
                    }
                }
                function hideElement(event) {
                    if (event) event.preventDefault();
                    if (elementOpen) {
                        elementContainer.classList.remove("active");
                        elementOpen = false;
                        document.removeEventListener(
                            "click",
                            outsideClickHandler
                        );
                        elementContent.removeEventListener(
                            "mouseleave",
                            contentMouseLeaveHandler
                        );
                    }
                }

                function contentMouseLeaveHandler() {
                    hideElement();
                    // elementContent.removeEventListener(
                    //     "mouseleave",
                    //     contentMouseLeaveHandler
                    // );
                }

                element.addEventListener("click", openElement);
                element.addEventListener("mouseenter", function() {
                    openElement();
                    // elementContent.addEventListener(
                    //     "mouseleave",
                    //     contentMouseLeaveHandler
                    // );
                });
            }
        }

        setupHandlers(document.querySelector(".js-news-previous-article"));
        setupHandlers(document.querySelector(".js-news-next-article"));
    }
};