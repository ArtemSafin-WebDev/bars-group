module.exports = {
    init: function() {
        const filter = document.querySelector(".catalog__button-filter");
        const stickyFilter = document.querySelector(".catalog__sticky-filter");

        if (filter && stickyFilter) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        stickyFilter.classList.remove("shown");
                        
                    } else {
                        stickyFilter.classList.add("shown");
                        
                    }
                });
            });

            observer.observe(filter);
        }
    }
};
