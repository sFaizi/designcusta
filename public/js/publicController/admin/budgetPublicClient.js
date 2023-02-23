const { adminDoms } = require('../../common/DOMs');
const { loading, hideLoading } = require('../../common/loader');
const { deleteClientBdgt, clientReply, readStatus } = require('./axiosRoutes');

exports.clientBdgtViewer = () => {
	if (adminDoms.clientBudgetParent) {
		adminDoms.clientBudgetViewer.style.display = 'none';
		adminDoms.clientBudgetTable.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.classList.contains('viewBdgClient')) {
				loading();
				adminDoms.clientBudgetViewer.style.display = '';
				adminDoms.clientBudgetTable.style.display = 'none';
				adminDoms.clientBudgetName.textContent = e.target.dataset.name;
				adminDoms.clientBudgetMail.textContent = e.target.dataset.email;
				adminDoms.clientBudgetPhone.textContent = e.target.dataset.phone;
				adminDoms.clientBudgetReceived.textContent = new Date(
					e.target.dataset.received
				);
				const graphicCharges = [];
				const webCharges = [];

				Object.entries(JSON.parse(e.target.dataset.web)).forEach((el) => {
					if (el[1] !== 0)
						webCharges.push(
							`<p class="clientBdgt_view_webBudget--serv">${el['0']} --------------- ${el[1]}</p>`
						);
				});

				Object.entries(JSON.parse(e.target.dataset.graphic)).forEach((el) => {
					if (el[1] !== 0)
						graphicCharges.push(
							`<p class="clientBdgt_view_graphicBudget--serv">${el['0']} --------------- ${el[1]}</p>`
						);
				});

				while (adminDoms.clientBudgetWebServices.childNodes[1])
					adminDoms.clientBudgetWebServices.childNodes[1].remove();
				while (adminDoms.clientBudgetGraphicServices.childNodes[1])
					adminDoms.clientBudgetGraphicServices.childNodes[1].remove();

				adminDoms.clientBudgetWebServices.childNodes[0].insertAdjacentHTML(
					'afterend',
					webCharges.join('')
				);
				adminDoms.clientBudgetGraphicServices.childNodes[0].insertAdjacentHTML(
					'afterend',
					graphicCharges.join('')
				);

				readStatus({ id: e.target.dataset.identity }, 'budgetClient');

				// Past replies
				while (adminDoms.clientBudgetHead.nextSibling)
					adminDoms.clientBudgetHead.nextSibling.remove();

				const replies = JSON.parse(e.target.dataset.reply);
				if (replies[0]) {
					replies.forEach((el) => {
						const html = `<div class="clientBdgt_view_past_reply">
							<h4 class="clientBdgt_view_past_reply--subject">${el.subject}</h4>
							<p class="clientBdgt_view_past_reply--msg">${el.message}</p>
							</div>`;

						adminDoms.clientBudgetHead.insertAdjacentHTML('afterend', html);
					});
				}
				hideLoading();
			}
		});
	}

	if (adminDoms.clientBudgetCloser) {
		adminDoms.clientBudgetCloser.addEventListener('click', (e) => {
			e.preventDefault();
			window.location.reload();
		});
	}
};

exports.clientBdgtRemover = () => {
	if (adminDoms.clientBudgetTable) {
		adminDoms.clientBudgetTable.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.classList.contains('removeBdgClient')) {
				const ans = confirm('Are you sure?');
				if (ans) {
					loading();
					deleteClientBdgt(e.target.dataset.delete);
				}
			}
		});
	}
};

exports.clientBdgtReplyer = () => {
	if (adminDoms.clientBudgetReplyers) {
		adminDoms.clientBudgetReplyers.forEach((el) => {
			el.addEventListener('submit', (e) => {
				e.preventDefault();
				if (el.childNodes[0].value && el.childNodes[1].value) {
					loading();
					clientReply({
						subject: el.childNodes[0].value,
						message: el.childNodes[1].value,
						email: adminDoms.clientBudgetMail.textContent,
						name: adminDoms.clientBudgetName.textContent,
						type: 'budget',
					});
					el.childNodes[0].value = '';
					el.childNodes[1].value = '';
				}
			});
		});
	}
};
