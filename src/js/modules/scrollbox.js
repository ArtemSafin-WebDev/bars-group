const scrollbarWidth = require('scrollbarwidth');

const elements = document.querySelectorAll('.js-scrollbox');
const collection = Array.prototype.slice.call(elements);
const padding = 30;

function isElementScrollable(elem) {
	return getComputedStyle(elem).overflowX == 'scroll';
}

function setNegativeOffset() {
	collection.forEach(function (elem) {
		var negativeOffset = - ( padding + scrollbarWidth() ) + 'px';
		elem.style.marginBottom = ( isElementScrollable(elem) ) ? negativeOffset : 0;
	});
}

setNegativeOffset();

window.addEventListener('resize', function () {
	setNegativeOffset();
});