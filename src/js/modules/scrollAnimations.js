module.exports = {
    init: function() {
        const blocksToAnimate = Array.prototype.slice.call(
            document.querySelectorAll(".block-wrapper")
        );

        blocksToAnimate.shift();

        const options = {
            threshold: 0.6
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    entry.target.classList.add("revealed");
                } else {
                    entry.target.classList.remove("revealed");
                }
            });
        }, options);

        blocksToAnimate.forEach(block => {
            block.classList.add('fade-in');
            observer.observe(block);
        });
    }
};
