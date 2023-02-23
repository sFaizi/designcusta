const { adminDoms } = require('../../common/DOMs');
const { loading, hideLoading } = require('../../common/loader');
const { deleteClientContact } = require('./axiosRoutes');

exports.clientContactRemover = () => {
	if (adminDoms.clCntTable) {
		adminDoms.clCntTable.addEventListener('click', (e) => {
			e.preventDefault();
			loading();
			if (e.target.classList.contains('removeContact')) {
				const ans = confirm('Are you sure?');
				if (ans) {
					loading();
					deleteClientContact(e.target.dataset.delete);
				}
			}
			hideLoading();
		});
	}
};
