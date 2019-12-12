module.exports = {
    init: function() {

        const landingMain = document.querySelector('.landing-main');
        if (!landingMain) {
            console.warn('No landing main');
            return;
        }
        const landingMainChildren = Array.prototype.slice.call(landingMain.children);
        const blocksToAnimate = landingMainChildren.filter(element => element.matches('.block-wrapper:not(.block-nav-sticker):not(.block-page--gap):not(.block-brand-box)'))
        
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
