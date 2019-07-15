var NewsToggles = {
    init: function() {
        var prev = document.querySelector('.js-news-previous-article')
        var prevContainer;
        var next = document.querySelector('.js-news-next-article')
        var nextContainer;
        var prevShown = false;
        var nextShown = false;

        function outsidePrevClickHandler(event) {
            if ((!prevContainer.contains(event.target) && event.target !== prevContainer)) {
                if (prevShown) {
                    prevContainer.classList.remove('active');
                    prevShown = false;
                    document.removeEventListener('click', outsidePrevClickHandler)
                }
            }
        }
        function outsideNextClickHandler(event) {
            if ((!nextContainer.contains(event.target) && event.target !== nextContainer)) {
                if (nextShown) {
                    nextContainer.classList.remove('active');
                    nextShown = false;
                    document.removeEventListener('click', outsideNextClickHandler)
                }
            }
        }

    
        if (prev) {
            prevContainer = prev.parentElement;

            prev.addEventListener('click', function(event) {
                event.preventDefault();
                prevContainer.classList.add('active')
                prevShown = true;
                document.addEventListener('click', outsidePrevClickHandler)
            })
        }
        if (next) {
            nextContainer = next.parentElement;

            next.addEventListener('click', function(event) {
                event.preventDefault();
                nextContainer.classList.add('active')
                nextShown = true;
                document.addEventListener('click', outsideNextClickHandler)
            })
        }
    }
}