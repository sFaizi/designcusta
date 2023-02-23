const { adminDoms } = require('../../common/DOMs');
const { loading } = require('../../common/loader');
const { access, logOut } = require('./axiosRoutes');

exports.login = () => {
	if (adminDoms.loginForm) {
		adminDoms.loginForm.addEventListener('submit', (e) => {
			e.preventDefault();
			loading();
			access({
				userID: adminDoms.user.value,
				password: adminDoms.pass.value,
			});
		});
	}
};

exports.logOut = () => {
	if (adminDoms.logout) {
		adminDoms.logout.forEach((el) => {
			el.addEventListener('click', () => {
				logOut();
			});
		});
	}
};
