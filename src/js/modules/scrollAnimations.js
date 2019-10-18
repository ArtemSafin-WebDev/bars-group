module.exports = {
    init: function() {

        const landingMain = document.querySelector('.landing-main');

        if (!landingMain) {
            console.warn('No landing main');
            return;
        }
        
        const blocksToAnimate = Array.prototype.slice.call(landingMain.children);

        blocksToAnimate.shift();

        const options = {
            // threshold: 0.35,
            rootMargin: "100px 0px 0px 0px"
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    entry.target.classList.add("revealed");
                } 
            });
        }, options);

        blocksToAnimate.forEach(block => {
            block.classList.add('fade-in');
            observer.observe(block);
        });
    }
};
