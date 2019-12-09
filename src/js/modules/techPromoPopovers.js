module.exports = {
    init: function() {
        const popovers = Array.prototype.slice.call(document.querySelectorAll('.js-tech-popovers'));


        popovers.forEach(element => {
            console.log(element);
            const buttons = Array.prototype.slice.call(element.querySelectorAll('.tech-promo__platform-link'));
            const items = Array.prototype.slice.call(element.querySelectorAll('.tech-promo__popovers-item'));

            function openItem(index) {
                items.forEach(item => item.classList.remove('active'));
                items[index].classList.add('active');
            }

            function closeItems() {
                items.forEach(item => item.classList.remove('active'));
            }

            function outsideClickHandler(event) {
                if (!element.contains(event.target) && event.target !== element) {
                    closeItems();
                }
            }


            buttons.forEach((btn, index) => {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();
                    openItem(index);
                })

                // btn.addEventListener('mouseenter', function() {
                //     openItem(index);
                // })
            })

            items.forEach((item, index) => {
                item.addEventListener('mouseenter', function() {
                    openItem(index);
                })
                item.addEventListener('mouseleave', function() {
                    closeItems();
                })
            })


            document.addEventListener('click', outsideClickHandler);
        });
    }
}