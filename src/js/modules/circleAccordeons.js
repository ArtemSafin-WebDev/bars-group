module.exports = {
    init: function() {
        const accordeonBtns = Array.prototype.slice.call(document.querySelectorAll('.js-circle-accordeons-btn'));
        const accordeonItems = Array.prototype.slice.call(document.querySelectorAll('.js-circle-accordeons-item'));
        const backgrounds = document.querySelector('.js-circle-accordeons-bg') ?Array.prototype.slice.call(document.querySelector('.js-circle-accordeons-bg').children) : [];

        accordeonBtns.forEach((btn, btnIndex) => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    $(btn.nextElementSibling).slideUp();
                    return;
                }
                accordeonItems.forEach(item => $(item).slideUp());
                accordeonBtns.forEach(btn => btn.classList.remove('active'));
                btn.classList.add('active');
                $(btn.nextElementSibling).slideDown();
                backgrounds.forEach((bg, bgIndex) => {
                    bg.classList.remove('active');
                    if (btnIndex === bgIndex) {
                        bg.classList.add('active');
                    }
                })
            })
        })
    }
}