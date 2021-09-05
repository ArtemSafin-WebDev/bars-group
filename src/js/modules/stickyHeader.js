module.exports = {
    init: function () {

        console.log('Sticky header enabled')

        if (!window.matchMedia('(max-width: 568px)').matches) return;

        const header = document.querySelector('.header');

        if (!header) {
            console.error('No header found');
            return;
        }

     
        ScrollTrigger.create({
            trigger: header,
            start: 'top top',
            pin: true,
            pinSpacing: false,
            endTrigger: 'html',
            end: 'bottom bottom',
            toggleClass: "fixed"
        });
    },
};
