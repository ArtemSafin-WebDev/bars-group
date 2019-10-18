module.exports = {
    init: function() {

        const landingMain = document.querySelector('.landing-main');

        if (!landingMain) {
            console.warn('No landing main');
            return;
        }
        
        const blocksToAnimate = Array.prototype.slice.call(landingMain.querySelectorAll('.block-wrapper:not(.block-nav-sticker)'));
        
        blocksToAnimate.shift();

        const options = {
            rootMargin: "150px 0px 0px 0px"
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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
