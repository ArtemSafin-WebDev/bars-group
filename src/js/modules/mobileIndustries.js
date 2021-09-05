module.exports = {
    init: function () {
        const SPEED = 0.4;

        const openAccordion = (element) => {
            gsap.to(element, {
                height: 'auto',
                duration: SPEED,
                onComplete: () => ScrollTrigger.refresh(),
            });
        };
        const closeAccordion = (element) => {
            gsap.to(element, {
                height: 0,
                duration: SPEED,
                onComplete: () => ScrollTrigger.refresh(),
            });
        };

        const elements = Array.from(document.querySelectorAll('.mobile-industries__accordion'));

        elements.forEach((element) => {
            const btn = element.querySelector('.mobile-industries__accordion-btn');
            const content = element.querySelector('.mobile-industries__accordion-content');

            btn.addEventListener('click', (event) => {
                event.preventDefault();

                elements.forEach((otherElement) => {
                    if (otherElement !== element) {
                        if (otherElement.classList.contains('active')) {
                            const content = otherElement.querySelector('.mobile-industries__accordion-content');
                            closeAccordion(content);
                            otherElement.classList.remove('active');
                        }
                    }
                });

                if (element.classList.contains('active')) {
                    closeAccordion(content);
                } else {
                    openAccordion(content);
                }
                element.classList.toggle('active');
            });
        });
    },
};
