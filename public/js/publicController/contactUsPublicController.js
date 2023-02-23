const axios = require('axios');
const { contactUsDOMs } = require('../common/DOMs');
const { loading } = require('../common/loader');
const alerts = require('../common/alerts');

const contactAxios = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/contact/contact-us',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'We will contact you back soon.');
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

exports.contactUs = () => {
	if (contactUsDOMs.contactUsForm) {
		const fileSizeOk = () => {
			let check = true;
			let size = 0;
			contactUsDOMs.allSamples.forEach((elm) => {
				if (elm.files[0]) {
					size += elm.files[0].size;
				}
				if (size > 810000) {
					check = false;
				}
			});
			return check;
		};

		const btnAlert = (html) => {
			document
				.querySelector('.contact_form--btn')
				.insertAdjacentHTML('beforeend', html);
			window.setTimeout(
				() => document.querySelector('.contact_form--btn-alert').remove(),
				2200
			);
		};

		generateExpression(contactUsDOMs.capchaExp);

		contactUsDOMs.capchaReload.addEventListener('click', () => {
			generateExpression(contactUsDOMs.capchaExp);
			contactUsDOMs.capchaAns.value = '';
			contactUsDOMs.capchaCheck.checked = '';
		});

		contactUsDOMs.contactUsForm.addEventListener('submit', (e) => {
			e.preventDefault();
			if (
				sum === contactUsDOMs.capchaAns.value &&
				contactUsDOMs.capchaCheck.checked &&
				fileSizeOk()
			) {
				loading();
				const form = new FormData();
				form.append('name', contactUsDOMs.name.value);
				form.append('email', contactUsDOMs.email.value);
				form.append('phone', contactUsDOMs.phone.value);
				form.append('describe', contactUsDOMs.describe.value);
				form.append('samples', contactUsDOMs.sample1.files[0]);
				form.append('samples', contactUsDOMs.sample2.files[0]);
				form.append('samples', contactUsDOMs.sample3.files[0]);

				contactAxios(form);
			} else if (
				sum === contactUsDOMs.capchaAns.value &&
				contactUsDOMs.capchaCheck.checked
			) {
				const html = `<span class="contact_form--btn-alert">Images all together larger than 800kb</span>`;
				btnAlert(html);
			} else {
				const html = `<span class="contact_form--btn-alert">Incorrect or unchecked!</span>`;
				btnAlert(html);
			}
		});
	}
};
