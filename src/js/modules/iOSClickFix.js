
(function () {

	var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

	if (!iOS) return;

	function appendStyle(styles) {
	  var css = document.createElement('style');
	  css.type = 'text/css';

	  if (css.styleSheet) css.styleSheet.cssText = styles;
	  else css.appendChild(document.createTextNode(styles));

	  document.getElementsByTagName("head")[0].appendChild(css);
	}

	var styles = '* {cursor: pointer; }';

	window.onload = function() { appendStyle(styles) };

})();