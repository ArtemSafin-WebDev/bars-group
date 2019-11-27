module.exports = {
  init: function() {
    var downloadBtns = Array.prototype.slice.call(
      document.querySelectorAll(".js-download-btn")
    );

    downloadBtns.forEach(btn => {
      btn.addEventListener("click", function(event) {
        event.preventDefault();
        var fileName =
          btn.hasAttribute("download") && btn.getAttribute("download") !== ""
            ? btn.getAttribute("download")
            : "";
        console.log("Filename", fileName);
        var href = btn.href;
        var btnBG = btn.querySelector(".download-btn__bg");
        var request = new XMLHttpRequest();

        request.addEventListener("readystatechange", function(e) {
          if (request.readyState == 2 && request.status == 200) {
            console.log("Download started");
            btn.classList.add("downloading");
          } else if (request.readyState == 3) {
            console.log("Download under progress");
          } else if (request.readyState == 4) {
            btn.classList.remove("downloading");
            btn.classList.add("download-finished");
            console.log("Download has finished");

            var URL = window.URL.createObjectURL(request.response);

            const a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = URL;
            a.setAttribute("download", fileName);
            a.click();

            setTimeout(function() {
              window.URL.revokeObjectURL(URL);
              document.body.removeChild(a);
              btnBG.style.transform = "";
              btn.classList.remove("download-finished");
              console.log("Returned to original state");
            }, 6000);
          }
        });

        request.addEventListener("progress", function(e) {
          var downloadProgress = e.loaded / e.total;
          console.log(downloadProgress);
          btnBG.style.transform = `scaleX(${downloadProgress})`;
        });

        request.responseType = "blob";

        // Downloading a JPEG file
        request.open("get", href);

        request.send();
      });
    });
  }
};
