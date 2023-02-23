const { navAndFootDOMs } = require('./DOMs');

const popupRemover = () => {
	while (navAndFootDOMs.offer.childNodes.length) {
		navAndFootDOMs.offer.childNodes[0].remove();
	}
};

const offerPopup = (html) => {
	navAndFootDOMs.offer.insertAdjacentHTML('afterbegin', html);
	window.setTimeout(() => {
		popupRemover();
	}, 8000);
};

module.exports = () => {
	if (navAndFootDOMs.offer) {
		if (navAndFootDOMs.offer.dataset.stat === 'true') {
			const html = `<div class="offer_box">
			<div class="offer_box--msg">${navAndFootDOMs.offer.dataset.msg}</div>
			<div class="offer_box--x">X</div>
			</div>`;
			offerPopup(html);
			navAndFootDOMs.offer.addEventListener('click', (e) => {
				if (e.target.classList.contains('offer_box--x')) {
					popupRemover();
				}
			});
		}
	}
};
