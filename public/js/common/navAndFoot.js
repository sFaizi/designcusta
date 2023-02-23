const axios = require('axios');
const alerts = require('./alerts');
const { navAndFootDOMs, serviceDOMs, contactUsDOMs } = require('./DOMs');

exports.navigation = () => {
	if (navAndFootDOMs.miniNavButton) {
		navAndFootDOMs.miniNavButton.addEventListener('click', function () {
			if (this.checked) {
				navAndFootDOMs.miniNav.style.height = '100vh';
			} else {
				navAndFootDOMs.miniNav.style.height = '4.5rem';
			}
		});
	}
};

exports.footer = () => {
	if (navAndFootDOMs.foot) {
		navAndFootDOMs.float.style.display = 'none';
		window.onscroll = () => {
			if (window.scrollY < 150) {
				navAndFootDOMs.float.style.display = 'none';
			} else if (
				window.scrollY >
				navAndFootDOMs.foot.offsetTop - navAndFootDOMs.foot.clientHeight
			) {
				navAndFootDOMs.float.style.display = 'none';
			} else {
				navAndFootDOMs.float.style.display = 'block';
			}
		};
	}
};
