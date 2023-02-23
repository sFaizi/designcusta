const { hideLoading } = require('./loader');

const hideAlert = () => {
	const el = document.querySelector('.alert');
	if (el) el.remove();
};

module.exports = (type, msg, time = 5) => {
	hideAlert();
	const markup = `
    <div class="alert">
			<div class="alert_${type}">
				<div class="alert_${type}--head">${
		type === 'success' ? 'Successfull!' : 'Failed'
	}</div>
				<div class="alert_${type}--msg">${msg}</div>
				<div class="alert_${type}--btn">X</div>
			</div>
    </div>
  `;
	document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
	document
		.querySelector(`.alert_${type}--btn`)
		.addEventListener('click', hideAlert);
	window.setTimeout(() => {
		hideAlert();
		hideLoading();
	}, time * 1000);
};
