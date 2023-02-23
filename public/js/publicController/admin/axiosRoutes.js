const axios = require('axios');
const alerts = require('../../common/alerts');

exports.access = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/admin/login-access',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'Logged in successfully.');
			window.setTimeout(() => window.location.assign('/c-panel'), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.logOut = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: '/api/v1/admin/logout',
		});

		if (res.headers.status === 'success') window.location.assign('/custamin');
	} catch (err) {
		alerts('fail', 'Error logging out! Please try again.');
	}
};

exports.deleteClientBdgt = async (id) => {
	try {
		const res = await axios.delete('/api/v1/admin/remove-bdgt-client', {
			data: { id },
		});

		if (res.headers.status === 'success') {
			alerts('success', 'Client removed.');
			window.setTimeout(() => window.location.reload({ force: true }), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.clientReply = async (data) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: '/api/v1/admin/customReply',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'E-mail sent.');
			window.location.reload();
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.deleteClient = async (id) => {
	try {
		const res = await axios.delete('/api/v1/admin/remove-client', {
			data: { id },
		});

		if (res.headers.status === 'success') {
			alerts('success', 'Client removed.');
			window.setTimeout(() => window.location.reload({ force: true }), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.deleteMail = async (id) => {
	try {
		const res = await axios.delete('/api/v1/admin/remove-directMail', {
			data: { id },
		});

		if (res.headers.status === 'success') {
			alerts('success', 'email deleted.');
			window.setTimeout(() => window.location.reload({ force: true }), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.deleteClientContact = async (id) => {
	try {
		const res = await axios.delete('/api/v1/admin/remove-contact', {
			data: { id },
		});

		if (res.headers.status === 'success') {
			alerts('success', 'client removed.');
			window.setTimeout(() => window.location.reload({ force: true }), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.readStatus = async (data, type) => {
	try {
		await axios({
			method: 'POST',
			url: `/api/v1/admin/read/${type}`,
			data,
		});
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.createCust = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/admin/create-cust',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'Changes saved.');
			window.setTimeout(() => window.location.reload(), 2500);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.deleteUser = async (id) => {
	try {
		const res = await axios.delete('/api/v1/admin/delUser', {
			data: { id },
		});

		if (res.headers.status === 'success') {
			alerts('success', 'User deleted.');
			window.setTimeout(() => window.location.reload({ force: true }), 2000);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};

exports.setOffer = async (data) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/admin/set-offer',
			data,
		});

		if (res.data.status === 'success') {
			alerts('success', 'Changes saved.');
			window.setTimeout(() => window.location.reload(), 2500);
		}
	} catch (err) {
		alerts('fail', err.response.data.message);
	}
};
