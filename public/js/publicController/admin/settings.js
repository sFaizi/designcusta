const { navAndFootDOMs, adminDoms } = require('../../common/DOMs');
const { createCust, deleteUser, setOffer } = require('./axiosRoutes');
const { loading } = require('../../common/loader');
const alerts = require('../../common/alerts');

exports.createCuster = () => {
	if (adminDoms.setParent) {
		adminDoms.custerForm.addEventListener('submit', (e) => {
			e.preventDefault();
			if (
				adminDoms.userID.value ||
				adminDoms.userPassNew.value ||
				adminDoms.userPassOld.value
			) {
				loading();
				createCust({
					user: adminDoms.userID.value,
					new: adminDoms.userPassNew.value,
					oldConfirm: adminDoms.userPassOld.value,
				});
			} else {
				alerts('fail', 'Complete all credential fields');
			}
		});
	}
};

exports.delUser = () => {
	if (adminDoms.userList) {
		adminDoms.userList.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.classList.contains('settings_user_list_cred--del')) {
				const ans = confirm('Are you sure?');
				if (ans) {
					loading();
					deleteUser(e.target.dataset.id);
				}
			}
		});
	}
};

exports.offerSet = () => {
	if (adminDoms.offerSwitch) {
		if (adminDoms.offerForm) {
			if (adminDoms.offerForm.dataset.status === 'true') {
				adminDoms.offerForm.style.display = 'grid';
			}
		}
		adminDoms.offerSwitch.addEventListener('click', () => {
			if (adminDoms.offerSwitch.checked) {
				adminDoms.offerForm.style.display = 'grid';
				setOffer({
					offerSet: true,
					offerMsg: navAndFootDOMs.offer.dataset.msg,
				});
			} else {
				adminDoms.offerForm.style.display = 'none';
				setOffer({
					offerSet: false,
					offerMsg: navAndFootDOMs.offer.dataset.msg,
				});
			}
		});
		adminDoms.offerForm.addEventListener('submit', (e) => {
			e.preventDefault();
			if (adminDoms.offerSwitch.checked) {
				setOffer({ offerSet: true, offerMsg: adminDoms.offerMsg.value });
			}
		});
	}
};
