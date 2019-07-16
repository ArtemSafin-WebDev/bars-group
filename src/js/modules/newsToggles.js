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
                    }
                }

                element.addEventListener("click", openElement);
            }
        }

        setupHandlers(document.querySelector(".js-news-previous-article"));
        setupHandlers(document.querySelector(".js-news-next-article"));
    }
};
