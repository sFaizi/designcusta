const anime = require('animejs');
const axios = require('axios');
const { homeDOMs } = require('../common/DOMs');
const { loading } = require('../common/loader');
const alerts = require('../common/alerts');

exports.planeMotion = () => {
	if (homeDOMs.homeParent) {
		if (window.matchMedia('(max-width: 800px)').matches) {
			document.querySelector('.home_working--path').childNodes[0].outerHTML =
				'<path id="path1" d="M94.51,0S-106.94,307.49,78.38,627.27,48,1070.61,48,1070.61"/>';
		}
		const path = anime.path('.home_working--path path');
		const getScrollPercent = () =>
			(homeDOMs.working.getBoundingClientRect().top /
				homeDOMs.working.getBoundingClientRect().height) *
			-100;
		const animation = anime({
			targets: '.home_working--aeroplane',
			translateX: path('x'),
			translateY: path('y'),
			rotate: path('angle'),
			easing: 'easeInOutSine',
			duration: 2000,
			loop: false,
			autoplay: false,
		});
		window.addEventListener('scroll', () => {
			const percent = getScrollPercent() + 40;
			if (percent >= 0 && percent <= 100) {
				animation.seek((percent / 100) * animation.duration);
			}
			if (percent >= 0)
				homeDOMs.discussImg.style.animation =
					'zoom 0.7s ease-in-out 1s 1 alternate';
			if (percent >= 30)
				homeDOMs.dealingImg.style.animation =
					'zoom 0.7s ease-in-out 1s 1 alternate';
			if (percent >= 70)
				homeDOMs.doneImg.style.animation =
					'zoom 0.7s ease-in-out 1s 1 alternate';
		});
	}
};

const callbackAxios = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/contact/callbacks',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'We will contact you back soon.');
			window.setTimeout(() => window.location.reload(), 2500);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.callback = () => {
	if (homeDOMs.callbackForm) {
		homeDOMs.callbackForm.addEventListener('submit', (e) => {
			e.preventDefault();
			loading();
			const form = {
				name: homeDOMs.callbackName.value,
				phone: homeDOMs.callbackPhone.value,
			};
			callbackAxios(form);
		});
	}
};
