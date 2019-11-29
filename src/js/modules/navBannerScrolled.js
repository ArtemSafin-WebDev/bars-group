module.exports = {
    init: function() {
        const navBannerScrollContainers = Array.prototype.slice.call(document.querySelectorAll('.nav-banner__list'));

        navBannerScrollContainers.forEach(element => {
            element.addEventListener('scroll', function() {
                document.body.classList.add('tabs-scrolled');
            })
        });
    }
}