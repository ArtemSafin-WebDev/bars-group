var InlineVideos = {
    init: function() {
       
        var inlineVideos = Array.prototype.slice.call(
            document.querySelectorAll(".js-photo-slider-video-link")
        );

        inlineVideos.forEach(function(video) {
            var link = video;
            var wrapper = link.parentElement;
            var url = link.getAttribute("href");
            var ID;
            var iframe;

            function parseYoutubeURL(url) {
                var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
                var match = url.match(regExp);
                return match && match[1].length == 11 ? match[1] : false;
            }

            if (url) {
                ID = parseYoutubeURL(url);
                
                var src =
                    "https://www.youtube.com/embed/" +
                    ID +
                    "?rel=0&showinfo=0&autoplay=1";
                if (ID) {
                    iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    iframe.setAttribute("src", src);
                }
            }

            link.addEventListener("click", function(event) {
                event.preventDefault();
                link.remove();
                wrapper.appendChild(iframe);
            });
        });
    }
};
