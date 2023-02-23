const axios = require('axios');
const { serviceDOMs } = require('../common/DOMs');
const { loading } = require('../common/loader');
const alerts = require('../common/alerts');

exports.toggleService = () => {
	if (serviceDOMs.serviceParent) {
		// Initial conditions
		serviceDOMs.graphicList.style.display = '';
		serviceDOMs.graphicLabel.style.border = 'none';
		serviceDOMs.graphicLabel.style.color = '#adadad';
		serviceDOMs.webList.style.display = 'grid';

		serviceDOMs.graphicRadio.addEventListener('click', () => {
			if (serviceDOMs.graphicRadio.checked) {
				// display
				serviceDOMs.graphicList.style.display = 'grid';
				serviceDOMs.webList.style.display = '';
				// border
				serviceDOMs.graphicLabel.style.border = '';
				serviceDOMs.webLabel.style.border = 'none';
				// color
				serviceDOMs.graphicLabel.style.color = '';
				serviceDOMs.webLabel.style.color = '#adadad';
			}
		});

		serviceDOMs.webRadio.addEventListener('click', () => {
			if (serviceDOMs.webRadio.checked) {
				// display
				serviceDOMs.graphicList.style.display = '';
				serviceDOMs.webList.style.display = 'grid';
				// border
				serviceDOMs.graphicLabel.style.border = 'none';
				serviceDOMs.webLabel.style.border = '';
				// color
				serviceDOMs.graphicLabel.style.color = '#adadad';
				serviceDOMs.webLabel.style.color = '';
			}
		});
	}
};

const allWebCharges = {};
const allGraphicCharges = {};

exports.serviceCal = () => {
	if (serviceDOMs.serviceParent) {
		// Value from direct check
		const calcPrice = () => {
			// from web
			for (const input of serviceDOMs.webCharge) {
				if (input.checked) {
					const cleanPrice = input.value.split(',').join('') * 1;
					if (!allWebCharges[input.id]) allWebCharges[input.id] = cleanPrice;
				}

				if (!input.checked) {
					allWebCharges[input.id] = 0;
					if (input.parentNode.nextSibling.childNodes[2])
						input.parentNode.nextSibling.childNodes[2].textContent = 'Add page';
				}
			}

			// from graphic
			for (const input of serviceDOMs.graphicCharge) {
				if (input.checked) {
					const cleanPrice = input.value.split(',').join('') * 1;
					allGraphicCharges[input.id] = cleanPrice;
				}

				if (!input.checked) {
					allGraphicCharges[input.id] = 0;
				}
			}

			let web = 0;
			let graphic = 0;
			Object.values(allWebCharges).forEach((el) => {
				web += el * 1;
			});
			Object.values(allGraphicCharges).forEach((el) => {
				graphic += el * 1;
			});

			serviceDOMs.webChargeDisplay.textContent = `Charges from web services ₹ ${web.toLocaleString(
				'en-IN'
			)}/-`;
			serviceDOMs.graphicChargeDisplay.textContent = `Charges from graphic services ₹${graphic.toLocaleString(
				'en-IN'
			)}/-`;
			serviceDOMs.totalCharge.textContent = `₹${(web + graphic).toLocaleString(
				'en-IN'
			)}/-`;
		};

		// Value from additional buttons
		serviceDOMs.additionalPagePriceBox.forEach((el) => {
			let sumPage = 0;
			// minus function
			if (el.childNodes[0].dataset.price) {
				const cost = Number(el.childNodes[0].dataset.price);
				let value = 0;
				el.childNodes[1].addEventListener('click', (e) => {
					e.preventDefault();
					if (value > 0) value -= 1;
					el.childNodes[2].textContent = `${value} page @ ${cost * value}`;
					if (el.previousSibling.childNodes[0].checked) {
						sumPage =
							cost * value +
							Number(
								el.previousSibling.childNodes[0].value.split(',').join('') * 1
							);
					} else {
						sumPage = cost * value;
					}
					allWebCharges[el.previousSibling.childNodes[0].id] = sumPage;
					calcPrice();
				});

				// plus function
				el.childNodes[3].addEventListener('click', (e) => {
					e.preventDefault();
					if (value < 14) value += 1;
					el.childNodes[2].textContent = `${value} page @ ${cost * value}`;
					el.previousSibling.childNodes[0].checked = 'checked';
					sumPage =
						cost * value +
						Number(
							el.previousSibling.childNodes[0].value.split(',').join('') * 1
						);
					allWebCharges[el.previousSibling.childNodes[0].id] = sumPage;
					calcPrice();
				});
			}
		});

		window.addEventListener('change', () => {
			calcPrice();
		});
	}
};

// contact with budget
const budgetAxios = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/contact/custBudget',
			data,
		});

		if (res.data.status === 'success') {
			alerts(
				'success',
				'Successfully submitted your budget. We will get back soon.'
			);
			window.setTimeout(() => window.location.reload(), 3000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

let sum = null;
const generateExpression = (expressionArea) => {
	const firstEq = Math.floor(Math.random() * 10);
	const secondEq = Math.floor(Math.random() * 10);
	expressionArea.textContent = `${firstEq} + ${secondEq} =`;
	sum = `${firstEq + secondEq}`;
};

const btnAlert = (html) => {
	document
		.querySelector('.services_request_form_submit')
		.insertAdjacentHTML('beforeend', html);
	window.setTimeout(
		() =>
			document.querySelector('.services_request_form_submit--alert').remove(),
		2200
	);
};

const checkBudget = () => {
	let status = false;
	Object.values(allWebCharges).forEach((el) => {
		if (el !== 0) status = true;
	});
	Object.values(allGraphicCharges).forEach((el) => {
		if (el !== 0) status = true;
	});
	return status;
};

exports.submitBudget = () => {
	if (serviceDOMs.formBudget) {
		generateExpression(serviceDOMs.capchaExp);

		serviceDOMs.capchaReload.addEventListener('click', () => {
			generateExpression(serviceDOMs.capchaExp);
			serviceDOMs.capchaAns.value = '';
			serviceDOMs.capchaCheck.checked = '';
		});

		serviceDOMs.formBudget.addEventListener('submit', (e) => {
			e.preventDefault();
			if (
				sum === serviceDOMs.capchaAns.value &&
				serviceDOMs.capchaCheck.checked &&
				checkBudget()
			) {
				const ans = confirm('I have reviewed my starting budget.');
				if (ans) {
					loading();
					budgetAxios({
						name: serviceDOMs.custNameBudget.value,
						email: serviceDOMs.custEmailBudget.value,
						phone: serviceDOMs.custPhoneBudget.value,
						allWebCharges,
						allGraphicCharges,
					});
				}
			} else if (
				sum === serviceDOMs.capchaAns.value &&
				serviceDOMs.capchaCheck.checked
			) {
				const html = `<span class="services_request_form_submit--alert">Select product</span>`;
				btnAlert(html);
			} else {
				const html = `<span class="services_request_form_submit--alert">Incorrect or unchecked!</span>`;
				btnAlert(html);
			}
		});
	}
};
